import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { ClassesService } from './classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getClasses(@Request() req) {
    return this.classesService.getClasses(req.user?.id);
  }

  @Post()
  createClass(@Body() data: Prisma.ClassCreateInput) {
    return this.classesService.createClass(data);
  }

  @Put('/instructor')
  assignInstructor(@Body() data: { classId: number; instructorId: number }) {
    return this.classesService.assignInstructor(data);
  }
}
