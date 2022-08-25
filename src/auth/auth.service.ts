import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    return this.generateToken(user);
  }

  async register(data: Prisma.UserCreateInput) {
    const candidate = await this.userService.getUserByEmail(data.email);
    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(data.password, 5);
    const client = await this.userService.createUser(
      {
        ...data,
        password: hashPassword,
      },
      true,
    );

    return this.generateToken(client.user);
  }

  private async generateToken(user: any) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY }),
      user,
    };
  }

  async validateUser(data: Prisma.UserCreateInput) {
    const user = await this.userService.getUserByEmail(data.email);
    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (user && passwordMatches) {
      return user;
    }

    return null;
  }

  async me(token: string | undefined): Promise<User> {
    const payload = this.jwtService.decode(token);
    return this.userService.getUserByEmail(payload['email']);
  }
}
