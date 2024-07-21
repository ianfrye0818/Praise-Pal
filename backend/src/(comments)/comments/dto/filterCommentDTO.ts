import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class FilterCommentDTO {
  @IsOptional()
  @IsString()
  commentId?: string;

  @IsOptional()
  @IsString()
  kudosId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort?: 'asc' | 'desc';
}
