"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const jwt_1 = require("@nestjs/jwt");
let UsersService = class UsersService {
    constructor(connection, jwtService) {
        this.connection = connection;
        this.jwtService = jwtService;
    }
    async createUser(name, loginId, email, password) {
        try {
            const checkQuery = `
        SELECT login_id, email FROM n4user
        WHERE login_id = ? OR email = ?
      `;
            const [existingUsers] = await this.connection.execute(checkQuery, [loginId, email]);
            if (existingUsers.length > 0) {
                const existingUser = existingUsers[0];
                if (existingUser.login_id === loginId) {
                    throw new common_1.ConflictException('Login ID already exists');
                }
                if (existingUser.email === email) {
                    throw new common_1.ConflictException('Email already exists');
                }
            }
            const salt = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await this.hashPassword(password, salt);
            const insertQuery = `
        INSERT INTO n4user (name, login_id, email, password, password_salt, created_date)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
            const [result] = await this.connection.execute(insertQuery, [name, loginId, email, hashedPassword, salt]);
            return { message: 'User created successfully', userId: result.insertId };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            console.error('Error creating user:', error);
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
    }
    async validateUser(loginId, password) {
        const query = `
      SELECT id, login_id, name, email, password, password_salt
      FROM n4user
      WHERE login_id = ?
    `;
        const [rows] = await this.connection.execute(query, [loginId]);
        if (rows.length === 0) {
            return null;
        }
        const user = rows[0];
        const hashedPassword = await this.hashPassword(password, user.password_salt);
        if (hashedPassword === user.password) {
            const { password, password_salt } = user, result = __rest(user, ["password", "password_salt"]);
            return result;
        }
        return null;
    }
    async login(user) {
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
    async saveRefreshToken(userId, refreshToken) {
        const query = `
      UPDATE n4user
      SET refresh_token = ?
      WHERE id = ?
    `;
        await this.connection.execute(query, [refreshToken, userId]);
    }
    async refreshAccessToken(refreshToken) {
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
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async findUserById(id) {
        const query = `
      SELECT id, login_id, refresh_token
      FROM n4user
      WHERE id = ?
    `;
        const [rows] = await this.connection.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    async logout(userId) {
        const query = `
      UPDATE n4user
      SET refresh_token = NULL
      WHERE id = ?
    `;
        await this.connection.execute(query, [userId]);
    }
    async hashPassword(password, salt) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
                if (err)
                    reject(err);
                resolve(derivedKey.toString('hex'));
            });
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map