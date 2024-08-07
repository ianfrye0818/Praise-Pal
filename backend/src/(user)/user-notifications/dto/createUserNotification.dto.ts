import { ActionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserNotificationDTO {
  @IsString()
  userId: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  commentId?: string;

  @IsOptional()
  @IsString()
  companyCode?: string;

  @IsEnum(
    [
      'COMMENT_LIKE',
      'KUDOS_LIKE',
      'COMMENT_COMMENT',
      'KUDOS_COMMENT',
      'KUDOS',
      'NEW_USER',
      'NEW_COMPANY',
    ],
    {
      message: 'Action Type Must Be LIKE, COMMENT, or KUDOS',
    },
  )
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  actionType: ActionType;

  @IsOptional()
  @IsString()
  kudosId?: string;

  @IsOptional()
  @IsString()
  newUserId?: string;
}
