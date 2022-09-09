import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login-input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: LoginInput) {
    const token = this.generateToken(user);
    return token;
  }
  private async generateToken(user: LoginInput) {
    const payload = {
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.PRIVATE_KEY,
      }),
      user,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (user && passwordMatches) {
      const { password, ...secureUser } = user;
      return secureUser;
    }

    return null;
  }
}
