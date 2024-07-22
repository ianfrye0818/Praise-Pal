import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateErrorDTO {
  @IsString()
  userId: string;

  @IsString()
  message: string;

  @IsString()
  stack: string;
}

export class UpdateErrorDTO extends PartialType(CreateErrorDTO) {}
