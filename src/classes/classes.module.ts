import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { ClassesService } from './classes.service';

@Module({
  providers: [ClassesService, UsersService, RolesService, PrismaService],
  exports: [ClassesService],
})
export class ClassesModule {}
