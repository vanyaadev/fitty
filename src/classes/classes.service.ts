import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ClassesService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  getClasses() {
    return this.prisma.class.findMany();
  }

  async createClass(data: Prisma.ClassCreateInput) {
    try {
      return await this.prisma.class.create({
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
          'Place or instructor is not found',
          HttpStatus.NOT_FOUND,
        );
    }
  }

  async assignInstructor(data: { className: string; instructorId: number }) {
    const user = await this.usersService.getUserById(data.instructorId);

    if (!user || !user.roles.some((role) => role.value === 'USER'))
      throw new HttpException(
        'User not found or user is not a instructor',
        HttpStatus.NOT_FOUND,
      );

    return this.prisma.class.update({
      where: {
        name: data.className,
      },
      data: {
        instructor: {
          connect: {
            id: data.instructorId,
          },
        },
      },
      include: {
        instructor: true,
      },
    });
  }
}
