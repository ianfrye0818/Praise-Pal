import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsOptional, IsString } from 'class-validator';

@Injectable()
export class CreateCommentDTO {
  @IsString()
  kudosId: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsString()
  userId: string;

  @IsString()
  content: string;
}

export class UpdateCommentDTO extends PartialType(CreateCommentDTO) {
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
