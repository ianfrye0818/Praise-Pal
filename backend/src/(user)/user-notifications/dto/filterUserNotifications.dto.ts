import { ActionType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterUserNotificationsDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    return value
      .toUpperCase()
      .split(',')
      .map((type: string) => type as ActionType);
  })
  actionTypes?: ActionType[];

  @IsOptional()
  @IsDate()
  createdAt?: string;

  @IsOptional()
  @IsDate()
  updatedAt?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: string;

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
