import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaService } from 'src/core-services/prisma.service';
import { JwtStrategy } from 'src/auth/stratagies/jwt-stratagy';
import { UserService } from 'src/(user)/user/user.service';
import { EmailService } from 'src/core-services/email.service';

@Module({
  controllers: [CommentsController],
  providers: [
    CommentsService,
    PrismaService,
    JwtStrategy,
    UserService,
    EmailService,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
