import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login-input';
import { LoginOutput } from './dto/login-ouput';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LoginOutput)
  async login(
    @Args('loginUserInput') loginUserInput: LoginInput,
    @Context() ctx,
  ) {
    const loginResponse = await this.authService.login(ctx.user);

    ctx.res.cookie('access_token', loginResponse.access_token);
    return loginResponse;
  }
}
