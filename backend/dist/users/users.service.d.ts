import { Pool, RowDataPacket } from 'mysql2/promise';
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
export declare class UsersService {
    private connection;
    private jwtService;
    constructor(connection: Pool, jwtService: JwtService);
    createUser(name: string, loginId: string, email: string, password: string): Promise<{
        message: string;
        userId: any;
    }>;
    validateUser(loginId: string, password: string): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            name: string;
            loginId: string;
            email: string;
        };
    }>;
    saveRefreshToken(userId: number, refreshToken: string): Promise<void>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    findUserById(id: number): Promise<User | null>;
    logout(userId: number): Promise<void>;
    private hashPassword;
}
export {};
