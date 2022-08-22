import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClassesService } from './classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get()
  getClasses() {
    return this.classesService.getClasses();
  }

  @Post()
  createClass(@Body() data: Prisma.ClassCreateInput) {
    return this.classesService.createClass(data);
  }

  @Put('/instructor')
  assignInstructor(@Body() data: { className: string; instructorId: number }) {
    return this.classesService.assignInstructor(data);
  }
}
