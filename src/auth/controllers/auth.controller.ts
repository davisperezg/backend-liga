import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('api/v1/auth/login')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Lgin
  @Post()
  async login(@Res() res, @Body() data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await this.authService.signIn(email, password);
    return res.status(HttpStatus.OK).json({
      message: 'User Logged',
      user,
    });
  }

  @Post('/token')
  async token(@Body() data: { email: string; refreshToken: string }) {
    return await this.authService.getTokenWithRefresh(data);
  }

  @Get('time')
  time() {
    return this.authService.time();
  }
}
