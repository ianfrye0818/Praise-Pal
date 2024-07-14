import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { updateUserDTO } from './dto/createUser.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { CompanyGuard } from '../../core-guards/company.guard';
import { FilterUserDTO } from './dto/filterUser.dto';
import { UpdateUserGuard } from './guards/update-user.guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CompanyGuard)
  @Get()
  async findAllUsers(@Query() query: FilterUserDTO) {
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

  @Patch(':id/restore')
  async restoreUserById(@Param('id') id: string) {
    return await this.userService.restoreUserById(id);
  }

  @UseGuards(UpdateUserGuard)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return await this.userService.softDeleteUserById(id);
  }
}
