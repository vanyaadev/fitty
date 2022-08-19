import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ClassesController } from './classes/classes.controller';
import { ClassesModule } from './classes/classes.module';

@Module({
  controllers: [ClassesController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ClassesModule,
  ],
})
export class AppModule {}
