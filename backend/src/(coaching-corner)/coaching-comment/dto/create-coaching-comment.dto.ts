import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class CreateCoachingCommentDTO {
  @IsString()
  coachingQuestionId: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsString()
  userId: string;

  @IsString()
  content: string;
}

export class UpdateCoachingCommentDTO extends PartialType(
  CreateCoachingCommentDTO,
) {}
