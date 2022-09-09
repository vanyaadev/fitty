import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/@generated/user/user.model';

@ObjectType()
export class LoginOutput {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}
