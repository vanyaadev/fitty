import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto, User } from 'src/users/users.model';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const access_token = await this.authService.login(req.user);

    res.cookie('token', access_token.token);
    return 'Success';
  }

  // @Post('/login')
  // login(@Body() userDto: CreateUserDto) {
  //   return this.authService.login(userDto);
  // }

  @Post('/register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getMe(@Request() req: any): Promise<User> {
    return this.authService.me(req.cookies['token'] ?? undefined);
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res) {
    res.cookie('token', '', { expires: new Date() });
    throw new HttpException('Forbidden', HttpStatus.NO_CONTENT);
  }
}
