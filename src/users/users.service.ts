import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { userInfo } from 'os';
import { Role } from 'src/roles/roles.model';

import { RolesService } from 'src/roles/roles.service';
import { UserRoles } from 'src/roles/user-roles.model';

import { AddRoleDto, BanUserDto, CreateUserDto, User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    const role = await this.roleService.getRoleByValue('USER');
    await user.addRole(role);

    return user;
  }

  async getAllUsers() {
    const users = await this.userModel.findAll({ include: { all: true } });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userModel.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      await user.addRole(role);
      return dto;
    }

    throw new HttpException('User or role was not found', HttpStatus.NOT_FOUND);
  }
  async banUser(dto: BanUserDto) {
    const user = await this.userModel.findByPk(dto.userId);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }
}
