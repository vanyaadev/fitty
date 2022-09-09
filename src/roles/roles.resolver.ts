import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Role } from 'src/@generated/role/role.model';
import { RolesService } from './roles.service';

@Resolver((of) => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query((returns) => Role)
  async role(@Args('value') value: string): Promise<Role> {
    const role = await this.rolesService.getRoleByValue(value);
    if (!role) {
      throw new NotFoundException(value);
    }
    return role;
  }

  @Query((returns) => [Role])
  roles(): Promise<Role[]> {
    return this.rolesService.getAllRoles();
  }
}
