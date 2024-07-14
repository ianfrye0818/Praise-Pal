import {
  Body,
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { KudosService } from './kudos.service';
import { createKudosDTO, UpdateKudosDTO } from './dto/createKudos.dto';
import { KudosFilterDTO } from './dto/kudosFilter.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { EditKudosGuard } from './guards/update-kudos.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CompanyGuard } from 'src/core-guards/company.guard';

@SkipThrottle()
@UseGuards(JwtGuard)
@Controller('kudos')
export class KudosController {
  constructor(private readonly kudosService: KudosService) {}

  // @UseGuards(SuperAdminGuard)
  @UseGuards(CompanyGuard)
  @Get()
  async findAll(@Query() query: KudosFilterDTO) {
    console.log('requested');
    const kudos = await this.kudosService.getAllKudos(query);

    return kudos;
  }

  @UseGuards(CompanyGuard)
  @Get(':kudoId')
  async findKudoById(@Param('kudoId') kudoId: string) {
    return await this.kudosService.getKudoById(kudoId);
  }

  @UseGuards(CompanyGuard)
  @Post()
  async createKudo(@Body() data: createKudosDTO) {
    return await this.kudosService.createKudo(data);
  }

  @UseGuards(EditKudosGuard)
  @Patch(':kudosId')
  async updateKudo(
    @Param('kudosId') kudosId: string,
    @Body() data: UpdateKudosDTO,
  ) {
    return await this.kudosService.updateKudoById(kudosId, data);
  }

  @UseGuards(EditKudosGuard)
  @Delete(':kudosId')
  async deleteKudo(@Param('kudosId') kudosId: string) {
    return await this.kudosService.deleteKudosById(kudosId);
  }
}
