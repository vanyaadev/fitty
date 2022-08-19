import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get()
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Post()
  create(@Body() data: Prisma.RoleCreateInput) {
    return this.roleService.createRole(data);
  }

  @Get('/:value')
  getByValue(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value);
  }
}
