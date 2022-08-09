import { IsEmail, IsString, Length } from 'class-validator';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { HasManyAddAssociationMixin } from 'sequelize/types';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';

interface UserCreationAttrs {
  email: string;
  password: string;
}

export class CreateUserDto {
  @IsString()
  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;
  @IsString()
  @Length(4, 16, { message: '4..16' })
  readonly password: string;
}

export class AddRoleDto {
  readonly value: string;
  readonly userId: number;
}

export class BanUserDto {
  readonly userId: number;
  readonly banReason: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  banned: boolean;

  @Column({
    type: DataType.STRING,
    defaultValue: false,
    allowNull: true,
  })
  banReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  declare addRole: HasManyAddAssociationMixin<Role, number>;
}
