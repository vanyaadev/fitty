import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getAllRoles() {
    return this.prisma.role.findMany();
  }

  async createRole(data: Prisma.RoleCreateInput) {
    const role = await this.prisma.role.create({
      data,
    });
    return role;
  }

  async getRoleByValue(value: string) {
    return this.prisma.role.findUnique({ where: { value } });
  }
}
