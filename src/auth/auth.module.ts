import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_KEY
  })],
  providers: [UsersService, AuthService, UsersRepository],
  controllers: [AuthController]
})
export class AuthModule { }
