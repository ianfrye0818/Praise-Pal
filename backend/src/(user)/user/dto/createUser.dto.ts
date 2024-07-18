import { PartialType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class createUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  companyCode: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'USER', 'COMPANY_OWNER'], {
    message: 'Role must be either Admin or User or Company Owner',
  })
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class updateUserDTO extends PartialType(createUserDTO) {
  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  deletedAt?: Date;
}
