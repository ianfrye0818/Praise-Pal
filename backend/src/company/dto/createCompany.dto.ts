import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { capitalizeWords } from '../../utils';
import { CompanyStatus } from '@prisma/client';
import { CreateCompanyContactDTO } from 'src/company-contact/dto/create-contact.dto';

export class CreateCompanyDTO {
  @IsString()
  @Transform(({ value }) => capitalizeWords(value as string))
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => capitalizeWords(value as string))
  address?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => capitalizeWords(value as string))
  city?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  state?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsString()
  phone: string;
}

export class UpdateCompanyDTO extends PartialType(CreateCompanyDTO) {
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsOptional()
  @IsEnum(['PENDING', 'ACTIVE', 'INACTIVE'], {
    message: 'Status must be either PENDING, ACTIVE, or INACTIVE',
  })
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  status: CompanyStatus;
}

export class CreateCompanyWithContactDto {
  @IsObject()
  contactInfo: CreateCompanyContactDTO;
  @IsObject()
  companyInfo: CreateCompanyDTO;
}
