import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { updateUserDTO } from './dto/createUser.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { CompanyGuard } from '../../core-guards/company.guard';
import { UpdateUserGuard } from '../../core-guards/update-user.guard';
import { FilterUserDTO } from './dto/filterUser.dto';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CompanyGuard)
  @Get()
  async findAllUsers(@Query() query: FilterUserDTO, @Req() req: Request) {
    return await this.userService.findAllUsers(query);
  }

  @UseGuards(CompanyGuard)
  @Get(':id')
  async findOneById(@Param('id') userId: string) {
    return await this.userService.findOneById(userId);
  }

  @UseGuards(UpdateUserGuard)
  @Patch(':id')
  async updateUserById(@Param('id') id: string, @Body() data: updateUserDTO) {
    return await this.userService.updateUserById(id, data);
  }

  @UseGuards(UpdateUserGuard)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return await this.userService.softDeleteUserById(id);
  }
}
