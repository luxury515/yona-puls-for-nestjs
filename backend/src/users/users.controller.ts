import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Req, HttpException, HttpStatus, Param, Query, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { AdminGuard } from '../guards/admin.guard';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() signupData: { name: string; loginId: string; email: string; password: string }) {
    try {
      await this.usersService.createUser(signupData.name, signupData.loginId, signupData.email, signupData.password);
      return { message: '회원가입이 성공적으로 완료되었습니다.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('회원가입에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() loginData: { loginId: string; password: string }) {
    const user = await this.usersService.validateUser(loginData.loginId, loginData.password);
    if (!user) {
      throw new UnauthorizedException('로그인 보가 올바르지 않습니다.');
    }
    const result = await this.usersService.login(user);
    return {
      ...result,
      message: '로그인에 성공했습니다.'
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req) {
    return { ...req.user, message: '프로필 정보를 성공적으로 불러왔습니다.' };
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refresh_token: string }) {
    try {
      const result = await this.usersService.refreshAccessToken(body.refresh_token);
      return { ...result, message: '토큰이 성공적으로 갱신되었습니다.' };
    } catch (error) {
      throw new UnauthorizedException('토큰 신에 실패했습니다.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req) {
    try {
      await this.usersService.logout(req.user.userId);
      return { message: '로그아웃 되었습니다.' };
    } catch (error) {
      throw new HttpException('로그아웃�� 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reset-password/:userId')
  async adminResetPassword(@Param('userId') userId: string) {
    try {
      await this.usersService.adminResetPassword(userId);
      return { message: '비밀번호가 성공적으로 초기화되었습니다.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('비밀번호 초기화에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    try {
      await this.usersService.sendPasswordResetEmail(email);
      return { message: '비밀번호 재설정 이메일이 전송되었습니다.' };
    } catch (error) {
      throw new HttpException('비밀번호 재설정 요청에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetData: { token: string; newPassword: string }) {
    try {
      await this.usersService.resetPasswordWithToken(resetData.token, resetData.newPassword);
      return { message: '비밀번호가 성공적으로 재설정되었습니다.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('비밀번호 재설정에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user-list')
  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getUsers(@Query('state') state?: string): Promise<User[]> {
    this.logger.log(`사용자 목록 요청 받음. 상태: ${state || '모든 상태'}`);
    const users = await this.usersService.getUsers(state);
    this.logger.log(`${users.length}명의 사용자를 찾았습니다.`);
    return users;
  }
}
