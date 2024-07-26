import { IsString } from 'class-validator';

export class InviteUserToPrivateRoomDTO {
  @IsString()
  creatorId: string;

  @IsString()
  invitedUserId: string;
}
