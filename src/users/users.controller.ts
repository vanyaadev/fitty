import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data);
  }

  @Get()
  getAll(@Req() request: Request) {
    return this.userService.getAllUsers();
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() data: { value: string; userId: number }) {
    return this.userService.addRole(data);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/ban')
  banUser(@Body() data: { userId: number; banReason: string }) {
    return this.userService.banUser(data);
  }
}
