import { Injectable, Inject, ConflictException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Pool, RowDataPacket } from 'mysql2/promise';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { format, toZonedTime, toDate } from 'date-fns-tz';
import { User } from './users.entity';

interface UserListResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private connection: Pool,
    private jwtService: JwtService,
  ) {
    this.initializeEmailTransporter();
  }

  private initializeEmailTransporter() {
    console.log('UsersService constructor called');
    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER }
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
      await this.checkExistingUser(loginId, email);
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await this.hashPassword(password, salt);
      const insertQuery = `
        INSERT INTO n4user (name, login_id, email, password, password_salt, created_date)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      const [result] = await this.connection.execute(insertQuery, [name, loginId, email, hashedPassword, salt]);
      return { message: 'User created successfully', userId: (result as any).insertId };
    } catch (error) {
      this.handleUserCreationError(error);
    }
  }

  private async checkExistingUser(loginId: string, email: string) {
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
  }

  private handleUserCreationError(error: any) {
    if (error instanceof ConflictException) {
      throw error;
    }
    console.error('Error creating user:', error);
    throw new InternalServerErrorException('Failed to create user');
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
      accessToken,
      refreshToken,
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

        return { access_token: newAccessToken, refresh_token: newRefreshToken };
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
    const user = await this.findUserForPasswordReset(userId);
    const newPassword = user.login_id;
    const hashedPassword = await this.hashPassword(newPassword, user.password_salt);
    await this.updateUserPassword(userId, hashedPassword);
  }

  private async findUserForPasswordReset(userId: string): Promise<User> {
    const findUserQuery = `
      SELECT login_id, password_salt
      FROM n4user
      WHERE id = ?
    `;
    const [users] = await this.connection.execute<User[]>(findUserQuery, [userId]);

    if (users.length === 0) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return users[0];
  }

  private async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    const updatePasswordQuery = `
      UPDATE n4user
      SET password = ?
      WHERE id = ?
    `;
    await this.connection.execute(updatePasswordQuery, [hashedPassword, userId]);
  }

  async adminResetPassword(userId: string): Promise<void> {
    await this.resetPassword(userId);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const user = await this.findUserByEmail(email);
      const resetToken = this.generateResetToken(user.id);
      await this.saveResetToken(user.id, resetToken);
      await this.sendResetEmail(email, resetToken);
    } catch (error) {
      this.handlePasswordResetEmailError(error);
    }
  }

  private async findUserByEmail(email: string): Promise<User> {
    const findUserQuery = `
      SELECT id, login_id
      FROM n4user
      WHERE email = ?
    `;
    const [users] = await this.connection.execute<User[]>(findUserQuery, [email]);

    if (users.length === 0) {
      throw new NotFoundException('해당 이메일로 등록된 사용자를 찾을 수 없습니다.');
    }

    return users[0];
  }

  private async saveResetToken(userId: number, resetToken: string): Promise<void> {
    const saveTokenQuery = `
      UPDATE n4user
      SET reset_token = ?, reset_token_expires = CONVERT_TZ(DATE_ADD(NOW(), INTERVAL 1 HOUR), '+00:00', ?)
      WHERE id = ?
    `;
    await this.connection.execute(saveTokenQuery, [resetToken, process.env.TIME_ZONE, userId]);
  }

  private async sendResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: `"Your App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '비밀번호 재설정',
      text: `비밀번호를 재설정하려면 다음 링크를 클릭하세요: ${resetLink}`,
      html: `<p>비밀번호를 재설정하려면 다음 링크를 클릭하세요:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('Email sent successfully. Message ID:', info.messageId);
  }

  private handlePasswordResetEmailError(error: any): never {
    console.error('Detailed error in sendPasswordResetEmail:', error);
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('비밀번호 재설정 이메일 전송에 실패했습니다: ' + error.message);
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
    try {
      const user = await this.findUserByResetToken(token);
      this.validateResetTokenExpiration(user.reset_token_expires);
      const hashedPassword = await this.hashPassword(newPassword, user.password_salt);
      await this.updatePasswordAndClearToken(user.id, hashedPassword);
    } catch (error) {
      this.handleResetPasswordError(error);
    }
  }

  private async findUserByResetToken(token: string): Promise<User> {
    const findUserQuery = `
      SELECT id, password_salt, reset_token, reset_token_expires
      FROM n4user
      WHERE reset_token = ?
    `;
    const [users] = await this.connection.execute<User[]>(findUserQuery, [token]);

    if (users.length === 0) {
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다.');
    }

    return users[0];
  }

  private validateResetTokenExpiration(resetTokenExpires: Date): void {
    const seoulTimeZone = 'Asia/Seoul';
    const now = new Date();
    const tokenExpires = toDate(resetTokenExpires, { timeZone: seoulTimeZone });

    if (isNaN(tokenExpires.getTime()) || now > tokenExpires) {
      throw new UnauthorizedException('만료된 토큰입니다.');
    }
  }

  private async updatePasswordAndClearToken(userId: number, hashedPassword: string): Promise<void> {
    const updatePasswordQuery = `
      UPDATE n4user
      SET password = ?, reset_token = NULL, reset_token_expires = NULL
      WHERE id = ?
    `;
    await this.connection.execute(updatePasswordQuery, [hashedPassword, userId]);
  }

  private handleResetPasswordError(error: any): never {
    console.error('비밀번호 재설정 중 오류 발생:', error);
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new InternalServerErrorException('비밀번호 재설정에 실패했습니다: ' + error.message);
  }

  private generateResetToken(userId: number): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async getUsers(state?: string): Promise<User[]> {
    let query = 'SELECT id, name, login_id, email, state FROM n4user';
    const params = [];

    if (state) {
      query += state === 'GUEST' ? ' WHERE is_guest = 1' : ' WHERE state = ?';
      if (state !== 'GUEST') params.push(state);
    }
    const [users] = await this.connection.execute<RowDataPacket[]>(query, params);
    return users as User[];
  }

  async getUserList(state: string, page: number, pageSize: number): Promise<UserListResponse> {
    const offset = (page - 1) * pageSize;
    let query = `
      SELECT id, name, login_id, email, state
      FROM n4user
      WHERE 1=1
    `;
    let countQuery = `
      SELECT COUNT(*) as total
      FROM n4user
      WHERE 1=1
    `;
    const queryParams = [];
    const countQueryParams = [];

    if (state !== 'ALL') {
      query += ` AND state = ?`;
      countQuery += ` AND state = ?`;
      queryParams.push(state);
      countQueryParams.push(state);
    }

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(pageSize, offset);

    try {
      const [users] = await this.connection.execute<RowDataPacket[]>(query, queryParams);
      const [countResult] = await this.connection.execute<RowDataPacket[]>(countQuery, countQueryParams);
      const totalCount = countResult[0].total;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        users: users as User[],
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      console.error('Error fetching user list:', error);
      throw new InternalServerErrorException('Failed to fetch user list');
    }
  }
}