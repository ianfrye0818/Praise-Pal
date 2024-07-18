import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDTO, updateUserDTO } from './dto/createUser.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { CompanyGuard } from '../../core-guards/company.guard';
import { FilterUserDTO } from './dto/filterUser.dto';
import { UpdateUserGuard } from './guards/update-user.guard';
import { AdminGuard } from 'src/core-guards/admin.guard';

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
  @Get('/company/:companyCode')
  async findAllByCompany(
    @Param('companyCode') companyCode: string,
    @Query() query: FilterUserDTO,
  ) {
    return await this.userService.findAllByCompany(companyCode, query);
  }

  @UseGuards(CompanyGuard)
  @Get(':userId')
  async findOneById(@Param('userId') userId: string) {
    return await this.userService.findOneById(userId);
  }

  @UseGuards(AdminGuard)
  @Post('/create')
  async createUser(@Body() data: createUserDTO) {
    return await this.userService.create(data);
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
