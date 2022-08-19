import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';

@Module({
  providers: [ClassesService],
})
export class ClassesModule {}
