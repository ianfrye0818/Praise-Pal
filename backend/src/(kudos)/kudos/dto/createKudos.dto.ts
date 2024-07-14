import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class createKudosDTO {
  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsString()
  companyCode: string;
}

export class UpdateKudosDTO extends PartialType(createKudosDTO) {
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsOptional()
  @IsInt()
  likes?: number;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}
