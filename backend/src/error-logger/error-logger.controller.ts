import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ErrorLoggerService } from './error-logger.service';
import { CreateErrorDTO } from './dto/create-error.dto';

@Controller('errors/logs')
export class ErrorLoggerController {
  constructor(private errorService: ErrorLoggerService) {}

  @Get()
  async getErrorLogs() {
    return await this.errorService.getErrorLogs();
  }

  @Get(':id')
  async getErrorById(id: string) {
    return await this.errorService.getErrorById(id);
  }

  @Post()
  async addErrorLog(@Body() error: CreateErrorDTO) {
    return await this.errorService.addErrorLog(error);
  }

  @Delete(':id')
  async deleteErrorById(id: string) {
    return await this.errorService.deleteErrorById(id);
  }
}
