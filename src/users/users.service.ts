import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RolesService } from 'src/roles/roles.service';

const mapRolesToUser = (user) => ({
  ...user,
  roles: user.roles.map((role) => role.role),
});

const mapClassToUser = (user) => ({
  ...user,
  classes: user.classes.map((cl) => cl.class),
});

const mapRolesAndClassesToUser = (user) => ({
  ...user,
  classes: user.classes.map((cl) => cl.class),
  roles: user.roles.map((role) => role.role),
});

const mapClientOrInstructorInfo = (user) => ({
  ...user,
  instructor: undefined,
  client: undefined,
  isInstructor: !!user.instructor,
  banned: user?.client?.banned,
  banReason: user?.client?.banReason,
  classes: user.client
    ? user.client.classes.map((cl) => cl.class)
    : user.instructor?.classes,
});

const includeRoles = {
  roles: {
    include: {
      role: true,
    },
  },
};
const includeClasses = {
  classes: {
    include: {
      class: true,
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
      include: { ...includeRoles, ...includeClasses },
    });

    return mapRolesAndClassesToUser(user);
  }

  async createUser(data: Prisma.UserCreateInput, isClient: boolean) {
    let role = await this.prisma.role.findFirst({
      where: {
        value: isClient ? 'USER' : 'INSTRUCTOR',
      },
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: {
          value: isClient ? 'USER' : 'INSTRUCTOR',
          description: isClient
            ? 'User with limited number of rights'
            : 'Instructor with group classes',
        },
      });
    }

    const prismaSchema: any = isClient
      ? this.prisma.client
      : this.prisma.instructor;

    const user = await prismaSchema.create({
      data: {
        user: {
          create: {
            email: data.email,
            password: data.password,
            name: data.name,
            surname: data.surname,
            roles: {
              create: [
                {
                  role: {
                    connect: {
                      id: role.id,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      include: {
        user: {
          include: includeRoles,
        },
      },
    });

    return user;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        ...includeRoles,
        client: { include: { classes: true } },
        instructor: { include: { classes: true } },
      },
    });

    return users.map(mapRolesToUser);
  }

  async getAllInstructors() {
    const instructors = await this.prisma.user.findMany({
      where: {
        instructor: {
          userId: {},
        },
      },
      include: {
        instructor: { include: { classes: true } },
      },
    });
    return instructors.map(mapClientOrInstructorInfo);
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { ...includeRoles },
    });

    return user ? mapRolesToUser(user) : null;
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
        include: { ...includeRoles },
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
    const user = await this.prisma.client.update({
      where: { userId },
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
      include: { ...includeClasses },
    });

    if (user) return mapClassToUser(user);

    throw new HttpException('User or role was not found', HttpStatus.NOT_FOUND);
  }

  async unEnrollFromClass(classId: number, userId: number) {
    return this.prisma.client.update({
      where: { userId },
      data: {
        classes: {
          deleteMany: { classId },
        },
      },
      include: { classes: true },
    });
  }

  async banUser(data: { userId: number; banReason: string }) {
    // const user = await this.prisma.user.update({
    //   where: { id: data.userId },
    //   data: {
    //     banned: true,
    //     banReason: data.banReason,
    //   },
    // });

    // if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // return user;
    return null;
  }
}
