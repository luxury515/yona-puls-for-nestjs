import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    signup(signupData: {
        name: string;
        loginId: string;
        email: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    login(loginData: {
        loginId: string;
        password: string;
    }): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            name: string;
            loginId: string;
            email: string;
        };
    }>;
    getProfile(req: any): any;
    refreshToken(body: {
        refresh_token: string;
    }): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
