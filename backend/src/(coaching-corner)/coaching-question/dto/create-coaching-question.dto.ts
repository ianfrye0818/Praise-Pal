import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCoachingQuestionDTO {
  @IsString()
  title: string;

  @IsString()
  question: string;

  @IsString()
  authorId: string;

  @IsString()
  companyCode: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class UpdateCoachingQuestionDTO extends PartialType(
  CreateCoachingQuestionDTO,
) {
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}
