import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    return this.generateToken(user);
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: any) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY }),
      user,
    };
  }

  async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordMatches = await bcrypt.compare(
      userDto.password,
      user.password,
    );

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
