import { IsString } from 'class-validator';

export class CreatePrivateCoachingRoomDTO {
  @IsString()
  coachingQuestionId: string;

  @IsString()
  userId: string;

  @IsString()
  responderId: string;
}
