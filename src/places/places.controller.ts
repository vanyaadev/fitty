import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get()
  getAllPlaces() {
    return this.placesService.getAllPlaces();
  }

  @Post()
  create(@Body() data: Prisma.PlaceCreateInput) {
    return this.placesService.createPlace(data);
  }
}
