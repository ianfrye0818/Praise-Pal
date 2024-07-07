import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../core-services/prisma.service';
import { EmailService } from '../../core-services/email.service';
import { JwtStrategy } from '../../auth/strategies/jwt-strategy';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, EmailService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
