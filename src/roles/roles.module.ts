import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';

import { PrismaService } from 'src/prisma.service';
import { RolesResolver } from './roles.resolver';

@Module({
  providers: [RolesService, PrismaService, RolesResolver],
  controllers: [RolesController],
  imports: [],
  exports: [RolesService],
})
export class RolesModule {}
