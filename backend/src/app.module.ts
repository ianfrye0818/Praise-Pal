import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './(user)/user/user.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { UserLikesModule } from './(kudos)/kudo-likes/kudo-likes.module';
import { UserNotificationsModule } from './(user)/user-notifications/user-notifications.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logger.interceptor';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommentLikesModule } from './(comments)/comment_likes/comment_likes.module';
import { CommentsModule } from './(comments)/comments/comments.module';
import { KudosModule } from './(kudos)/kudos/kudos.module';
import { VerifyModule } from './verify/verify.module';
import { CompanyContactModule } from './company-contact/company-contact.module';
import { ErrorLoggerModule } from './error-logger/error-logger.module';
import { CoachingQuestionModule } from './(coaching-corner)/coaching-question/coaching-question.module';
import { CoachingCommentModule } from './(coaching-corner)/coaching-comment/coaching-comment.module';
import { PrivateCoachingRoomModule } from './(coaching-corner)/private-coaching-room/private-coaching-room.module';

@Module({
  imports: [
    UserModule,
    CompanyModule,
    KudosModule,
    UserLikesModule,
    AuthModule,
    UserNotificationsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 5000,
        limit: 10,
      },
    ]),
    CommentsModule,
    CommentLikesModule,
    VerifyModule,
    CompanyContactModule,
    ErrorLoggerModule,
    CoachingQuestionModule,
    CoachingCommentModule,
    PrivateCoachingRoomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // PrismaService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
