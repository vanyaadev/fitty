import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateRoleDto, Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) roleModel: typeof Role) {}
  async createRole(dto: CreateRoleDto) {}
}
