import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RolesService } from 'src/roles/roles.service';

const mapRolesToUser = (user) => ({
  ...user,
  roles: user.roles.map((role) => role.role),
});

const mapClassToUser = (user) => ({
  ...user,
  classes: user.classes.map((class_) => class_.class),
});

const includeRoles = {
  roles: {
    include: {
      role: true,
    },
  },
};

@Injectable()
export class UsersService {
  constructor(
    private roleService: RolesService,
    private prisma: PrismaService,
  ) {}

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: includeRoles,
    });

    return mapRolesToUser(user);
  }

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

    const user = await this.prisma.user.create({
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
      include: includeRoles,
    });

    return mapRolesToUser(user);
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: includeRoles,
    });

    return users.map(mapRolesToUser);
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: includeRoles,
    });

    return mapRolesToUser(user);
  }

  async addRole({ roleValue, userId }: { roleValue: string; userId: number }) {
    try {
      const role = await this.prisma.role.findUniqueOrThrow({
        where: { value: roleValue },
      });

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
        include: includeRoles,
      });
      return mapRolesToUser(user);
    } catch (e) {
      if (e.code === 'P2002')
        throw new HttpException(
          'There is a unique constraint violation',
          HttpStatus.CONFLICT,
        );
      else
        throw new HttpException(
          'User or role is not found',
          HttpStatus.NOT_FOUND,
        );
    }
  }

  async enrollToClass(classId: number, userId: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        classes: {
          create: [
            {
              class: {
                connect: { id: classId },
              },
            },
          ],
        },
      },
      include: {
        classes: {
          include: { class: true },
        },
      },
    });

    if (user) return mapClassToUser(user);

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
