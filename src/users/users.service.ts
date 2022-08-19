import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RolesService } from 'src/roles/roles.service';

const mapRolesToUser = (user) => ({
  ...user,
  roles: user.roles.map((role) => role.role),
});

@Injectable()
export class UsersService {
  constructor(
    private roleService: RolesService,
    private prisma: PrismaService,
  ) {}

  async createUser(data: Prisma.UserCreateInput) {
    let roleUser = await this.prisma.role.findFirst({
      where: {
        value: 'USER',
      },
    });

    if (!roleUser) {
      roleUser = await this.prisma.role.create({
        data: {
          value: 'USER',
          description: 'User with limited number of rights',
        },
      });
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        roles: {
          create: [
            {
              role: {
                connect: {
                  id: roleUser.id,
                },
              },
            },
          ],
        },
      },
    });
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return users.map(mapRolesToUser);
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
    return user;
  }

  async addRole({ value, userId }: { value: string; userId: number }) {
    const role = await this.roleService.getRoleByValue(value);

    if (role) {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          roles: {
            create: [
              {
                role: {
                  connect: { id: role.id },
                },
              },
            ],
          },
        },
        include: {
          roles: {
            include: { role: true },
          },
        },
      });

      if (user) return mapRolesToUser(user);
    }

    throw new HttpException('User or role was not found', HttpStatus.NOT_FOUND);
  }
  async banUser(data: { userId: number; banReason: string }) {
    const user = await this.prisma.user.update({
      where: { id: data.userId },
      data: {
        banned: true,
        banReason: data.banReason,
      },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }
}
