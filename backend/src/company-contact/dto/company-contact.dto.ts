import { Transform } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { capitalizeWords } from '../../utils';
import { BestTimeToContact } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDTO } from 'src/company/dto/createCompany.dto';
export class CreateCompanyContactDTO {
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  companyCode: string;
  @IsString()
  @Transform(({ value }: { value: string }) => capitalizeWords(value))
  firstName: string;
  @IsString()
  @Transform(({ value }: { value: string }) => capitalizeWords(value))
  lastName: string;
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;
  @IsString()
  phone: string;
  @IsEnum(['MORNING', 'AFTERNOON', 'EVENING'], {
    message: 'Contact time must be either MORNING, AFTERNOON, or EVENING',
  })
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  bestTimeToContact: BestTimeToContact;
}
export class UpdateCompanyContactDTO extends PartialType(
  CreateCompanyContactDTO,
) {}
