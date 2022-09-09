import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ClientCreateNestedOneWithoutUserInput } from 'src/@generated/client/client-create-nested-one-without-user.input';
import { InstructorCreateNestedOneWithoutUserInput } from 'src/@generated/instructor/instructor-create-nested-one-without-user.input';
import { UserOnRolesCreateNestedManyWithoutUserInput } from 'src/@generated/user-on-roles/user-on-roles-create-nested-many-without-user.input';

@InputType()
export class UserCreateInput {
  @Field(() => String, { nullable: false })
  email!: string;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  surname!: string;

  @Field(() => String, { nullable: false })
  password!: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;

  @Field(() => UserOnRolesCreateNestedManyWithoutUserInput, { nullable: true })
  roles?: UserOnRolesCreateNestedManyWithoutUserInput;

  @Field(() => InstructorCreateNestedOneWithoutUserInput, { nullable: true })
  instructor?: InstructorCreateNestedOneWithoutUserInput;

  @Field(() => ClientCreateNestedOneWithoutUserInput, { nullable: true })
  client?: ClientCreateNestedOneWithoutUserInput;
}
