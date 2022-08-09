import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from 'src/users/users.model';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const access_token = await this.authService.login(req.user);
    res.cookie('token', access_token.token);
  }

  // @Post('/login')
  // login(@Body() userDto: CreateUserDto) {
  //   return this.authService.login(userDto);
  // }

  @Post('/register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Get('signout')
  async logout(@Res({ passthrough: true }) res) {
    res.cookie('token', '', { expires: new Date() });
  }
}
