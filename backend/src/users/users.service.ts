import { Injectable, Inject, ConflictException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Pool, RowDataPacket } from 'mysql2/promise';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

interface User extends RowDataPacket {
  id: number;
  login_id: string;
  name: string;
  email: string;
  password: string;
  password_salt: string;
  refresh_token?: string;
}

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private connection: Pool,
    private jwtService: JwtService,
  ) {
    console.log('UsersService constructor called');
    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
      }
    });

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP Transporter Error:', error);
      } else {
        console.log('SMTP Transporter is ready to send emails');
      }
    });
  }

  async createUser(name: string, loginId: string, email: string, password: string) {
    try {
      const checkQuery = `
        SELECT login_id, email FROM n4user
        WHERE login_id = ? OR email = ?
      `;
      const [existingUsers] = await this.connection.execute<RowDataPacket[]>(checkQuery, [loginId, email]);

      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        if (existingUser.login_id === loginId) {
          throw new ConflictException('Login ID already exists');
        }
        if (existingUser.email === email) {
          throw new ConflictException('Email already exists');
        }
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await this.hashPassword(password, salt);
      const insertQuery = `
        INSERT INTO n4user (name, login_id, email, password, password_salt, created_date)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      const [result] = await this.connection.execute(insertQuery, [name, loginId, email, hashedPassword, salt]);
      return { message: 'User created successfully', userId: (result as any).insertId };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async validateUser(loginId: string, password: string): Promise<User | null> {
    const query = `
      SELECT id, login_id, name, email, password, password_salt
      FROM n4user
      WHERE login_id = ?
    `;
    const [rows] = await this.connection.execute<User[]>(query, [loginId]);
    if (rows.length === 0) {
      return null;
    }
    const user = rows[0];
    const hashedPassword = await this.hashPassword(password, user.password_salt);
    if (hashedPassword === user.password) {
      const { password, password_salt, ...result } = user;
      return result as User;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.login_id, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        loginId: user.login_id,
        email: user.email
      }
    };
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    const query = `
      UPDATE n4user
      SET refresh_token = ?
      WHERE id = ?
    `;
    await this.connection.execute(query, [refreshToken, userId]);
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.findUserById(payload.sub);
      
      if (user && user.refresh_token === refreshToken) {
        const newPayload = { username: user.login_id, sub: user.id };
        const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
        
        const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });
        await this.saveRefreshToken(user.id, newRefreshToken);

        return {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        };
      }
      throw new UnauthorizedException('Invalid refresh token');
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async findUserById(id: number): Promise<User | null> {
    const query = `
      SELECT id, login_id, refresh_token
      FROM n4user
      WHERE id = ?
    `;
    const [rows] = await this.connection.execute<User[]>(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async logout(userId: number) {
    const query = `
      UPDATE n4user
      SET refresh_token = NULL
      WHERE id = ?
    `;
    await this.connection.execute(query, [userId]);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
  }

  async resetPassword(userId: string): Promise<void> {
    const findUserQuery = `
      SELECT login_id, password_salt
      FROM n4user
      WHERE id = ?
    `;
    const [users] = await this.connection.execute<User[]>(findUserQuery, [userId]);

    if (users.length === 0) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const user = users[0];
    const newPassword = user.login_id;
    const hashedPassword = await this.hashPassword(newPassword, user.password_salt);

    const updatePasswordQuery = `
      UPDATE n4user
      SET password = ?
      WHERE id = ?
    `;
    await this.connection.execute(updatePasswordQuery, [hashedPassword, userId]);
  }

  async adminResetPassword(userId: string): Promise<void> {
    const findUserQuery = `
      SELECT login_id, password_salt
      FROM n4user
      WHERE id = ?
    `;
    const [users] = await this.connection.execute<User[]>(findUserQuery, [userId]);

    if (users.length === 0) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const user = users[0];
    const newPassword = user.login_id;
    const hashedPassword = await this.hashPassword(newPassword, user.password_salt);

    const updatePasswordQuery = `
      UPDATE n4user
      SET password = ?
      WHERE id = ?
    `;
    await this.connection.execute(updatePasswordQuery, [hashedPassword, userId]);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    console.log('sendPasswordResetEmail called with email:', email);
    try {
      console.log('Attempting to send password reset email to:', email);

      const findUserQuery = `
        SELECT id, login_id
        FROM n4user
        WHERE email = ?
      `;
      console.log('Executing query:', findUserQuery, 'with params:', [email]);
      const [users] = await this.connection.execute<User[]>(findUserQuery, [email]);

      console.log('Query result:', users);

      if (users.length === 0) {
        console.log('User not found for email:', email);
        throw new NotFoundException('해당 이메일로 등록된 사용자를 찾을 수 없습니다.');
      }

      const user = users[0];
      console.log('User found:', user);

      const resetToken = this.generateResetToken(user.id);
      console.log('Reset token generated:', resetToken);

      const saveTokenQuery = `
        UPDATE n4user
        SET reset_token = ?, reset_token_expires = CONVERT_TZ(DATE_ADD(NOW(), INTERVAL 1 HOUR), '+00:00', ?)
        WHERE id = ?
      `;
      console.log('Executing query:', saveTokenQuery, 'with params:', [resetToken, process.env.TIME_ZONE, user.id]);
      await this.connection.execute(saveTokenQuery, [resetToken, process.env.TIME_ZONE, user.id]);
      console.log('Reset token saved to database');

      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
      const mailOptions = {
        from: `"Your App" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '비밀번호 재설정',
        text: `비밀번호를 재설정하려면 다음 링크를 클릭하세요: ${resetLink}`,
        html: `<p>비밀번호를 재설정하려면 다음 링크를 클릭하세요:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      };

      console.log('Attempting to send email with options:', JSON.stringify(mailOptions, null, 2));

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully. Message ID:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Detailed error in sendPasswordResetEmail:', error);
      if (error.response) {
        console.error('SMTP Response:', error.response);
      }
      console.error('Error stack:', error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('비밀번호 재설정 이메일 전송에 실패했습니다: ' + error.message);
    }
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
    const findUserQuery = `
      SELECT id, password_salt, reset_token, 
             CONVERT_TZ(reset_token_expires, ?, '+00:00') as reset_token_expires
      FROM n4user
      WHERE reset_token = ?
    `;
    const [users] = await this.connection.execute<User[]>(findUserQuery, [process.env.TIME_ZONE, token]);

    if (users.length === 0) {
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다.');
    }

    const user = users[0];

    const now = new Date();
    const tokenExpires = new Date(user.reset_token_expires);
    console.log('Current time:', now);
    console.log('Token expires:', tokenExpires);

    if (now > tokenExpires) {
      throw new UnauthorizedException('만료된 토큰입니다.');
    }

    const hashedPassword = await this.hashPassword(newPassword, user.password_salt);

    const updatePasswordQuery = `
      UPDATE n4user
      SET password = ?, reset_token = NULL, reset_token_expires = NULL
      WHERE id = ?
    `;
    await this.connection.execute(updatePasswordQuery, [hashedPassword, user.id]);
  }

  private generateResetToken(userId: number): string {
    const token = crypto.randomBytes(32).toString('hex');
    console.log('Generated reset token:', token, 'for user ID:', userId);
    return token;
  }
}