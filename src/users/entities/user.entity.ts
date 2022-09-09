import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Client } from 'src/@generated/client/client.model';
import { Instructor } from 'src/@generated/instructor/instructor.model';
import { UserOnRoles } from 'src/@generated/user-on-roles/user-on-roles.model';
import { UserCount } from 'src/@generated/user/user-count.output';

export class User {
  @Field(() => ID, { nullable: false })
  id!: number;

  @Field(() => String, { nullable: false })
  email!: string;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  surname!: string;

  @Field(() => String, { nullable: false })
  password!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => [UserOnRoles], { nullable: true })
  roles?: Array<UserOnRoles>;

  @Field(() => Instructor, { nullable: true })
  instructor?: Instructor | null;

  @Field(() => Client, { nullable: true })
  client?: Client | null;

  @Field(() => UserCount, { nullable: false })
  _count?: UserCount;
}
