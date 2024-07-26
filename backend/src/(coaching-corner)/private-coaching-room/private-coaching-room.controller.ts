import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrivateCoachingRoomService } from './private-coaching-room.service';
import { CompanyGuard } from 'src/core-guards/company.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreatePrivateCoachingRoomDTO } from './dto/create-private-room.dto';
import { InviteUserToPrivateRoomDTO } from './dto/invite-user-to-private-room.dto';

@UseGuards(JwtGuard, CompanyGuard)
@Controller('private-coaching-room')
export class PrivateCoachingRoomController {
  constructor(
    private readonly privateRoomService: PrivateCoachingRoomService,
  ) {}

  @Get(':roomId')
  async getRoom(@Param('roomId') roomId: string) {
    return this.privateRoomService.getRoom(roomId);
  }

  @Post()
  async createRoom(@Body() data: CreatePrivateCoachingRoomDTO) {
    return this.privateRoomService.createRoom(data);
  }

  @Post(':roomId/invite')
  async invite(
    @Param('roomId') roomId: string,
    data: InviteUserToPrivateRoomDTO,
  ) {
    return this.privateRoomService.invite(roomId, data);
  }

  @Delete(':roomId')
  async deleteRoom(@Param('roomId') roomId: string) {
    return this.privateRoomService.deleteRoom(roomId);
  }
}
