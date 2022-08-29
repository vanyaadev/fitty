import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UsePipes(ValidationPipe)
  @Post('/client')
  createClient(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data, true);
  }

  @UsePipes(ValidationPipe)
  @Post('/instructor')
  createInstructor(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data, false);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll(@Req() request: Request) {
    return this.userService.getAllUsers();
  }

  @Get('/instructors')
  getAllInstructors() {
    return this.userService.getAllInstructors();
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() data) {
    return this.userService.addRole(data);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/ban')
  banUser(@Body() data: { userId: number; banReason: string }) {
    return this.userService.banUser(data);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/unban')
  unBanUser(@Body() data: { userId: number }) {
    return this.userService.unBanUser(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/class/:classId')
  enrollToClass(
    @Request() req,
    @Param('classId', ParseIntPipe) classId: number,
  ) {
    return this.userService.enrollToClass(classId, req.user?.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/class/:classId')
  unEnrollFromClass(
    @Request() req,
    @Param('classId', ParseIntPipe) classId: number,
  ) {
    return this.userService.unEnrollFromClass(classId, req.user?.id);
  }
}
