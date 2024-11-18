import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';  // Required to work with JWT tokens
import { TypeOrmModule } from '@nestjs/typeorm';  // Required to access the database
import { User } from '../users/entities/user.entity';  // Required if you're interacting with User entity
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15h' },
    })
  ],
  providers: [AuthService,JwtStrategy,UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
