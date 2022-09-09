import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { PrismaService } from 'src/prisma.service';
// import { UpdateUserInput } from './dto/update-user.input';

const includeRoles = {
  roles: {
    include: {
      role: true,
    },
  },
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: UserCreateInput, isClient: boolean) {
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
            email: createUserInput.email,
            password: createUserInput.password,
            name: createUserInput.name,
            surname: createUserInput.surname,
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

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { client: true, instructor: true },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { client: true, instructor: true },
    });
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

// async login(user: any) {
//   return this.generateToken(user);
// }

// async register(data: Prisma.UserCreateInput, isClient = true) {
//   const candidate = await this.userService.getUserByEmail(data.email);
//   if (candidate) {
//     throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
//   }

//   const hashPassword = await bcrypt.hash(data.password, 5);
//   const client = await this.userService.createUser(
//     {
//       ...data,
//       password: hashPassword,
//     },
//     isClient,
//   );

//   return this.generateToken(client.user);
// }

// private async generateToken(user: any) {
//   const payload = {
//     email: user.email,
//     id: user.id,
//     roles: user.roles,
//   };
//   return {
//     token: this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY }),
//     user,
//   };
// }

// async validateUser(data: { email: string; password: string }) {
//   const user = await this.userService.getUserByEmail(data.email);
//   const passwordMatches = await bcrypt.compare(data.password, user.password);

//   if (user && passwordMatches) {
//     return user;
//   }

//   return null;
// }

// async me(token: string | undefined): Promise<User> {
//   const payload = this.jwtService.decode(token);
//   return this.userService.getUserByEmail(payload['email']);
// }
