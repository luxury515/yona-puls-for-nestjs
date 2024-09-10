import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
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
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
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
      throw new UnauthorizedException('토큰 갱신에 실패했습니다.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req) {
    await this.usersService.logout(req.user.userId);
    return { message: '로그아웃 되었습니다.' };
  }
}