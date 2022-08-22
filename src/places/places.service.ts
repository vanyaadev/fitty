import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  async getAllPlaces() {
    return this.prisma.place.findMany();
  }

  async createPlace(data: Prisma.PlaceCreateInput) {
    try {
      return await this.prisma.place.create({
        data,
      });
    } catch (e) {
      if (e.code === 'P2002')
        throw new HttpException(
          'There is a unique constraint violation',
          HttpStatus.CONFLICT,
        );
      else
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
