import { ActionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export class CreateUserNotificationDTO {
  @IsString()
  userId: string;

  @IsString()
  message: string;

  @IsEnum(['LIKE', 'COMMENT', 'KUDOS'], {
    message: 'Action Type Must Be LIKE, COMMENT, or KUDOS',
  })
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  actionType: ActionType;

  @IsString()
  referenceId: string;
}

// export class UpdateUserNotificationDTO extends PartialType(
//   CreateUserNotificationDTO,
// ) {
//   @IsOptional()
//   @IsBoolean()
//   isRead?: boolean;

//   @IsOptional()
//   @IsDate()
//   deletedAt?: Date;
// }
