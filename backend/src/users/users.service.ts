import { Injectable, Inject, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Pool, RowDataPacket } from 'mysql2/promise';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

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
  constructor(
    @Inject('DATABASE_CONNECTION')
    private connection: Pool,
    private jwtService: JwtService
  ) {}

  async createUser(name: string, loginId: string, email: string, password: string) {
    try {
      // 먼저 사용자 ID와 이메일의 중복 여부를 확인
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
        
        // 새로운 refresh token 생성 및 저장
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
}