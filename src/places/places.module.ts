import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlacesService } from './places.service';

@Module({
  providers: [PlacesService, PrismaService],
  exports: [PlacesService],
})
export class PlacesModule {}
