import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ClassesController } from './classes/classes.controller';
import { ClassesModule } from './classes/classes.module';
import { PlacesController } from './places/places.controller';
import { PlacesModule } from './places/places.module';

@Module({
  controllers: [ClassesController, PlacesController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ClassesModule,
    PlacesModule,
  ],
})
export class AppModule {}
