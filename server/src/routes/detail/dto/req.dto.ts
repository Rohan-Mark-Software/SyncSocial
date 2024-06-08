import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { PlanEntity } from 'src/database/entities/plan.entity';
import { UserEntity } from 'src/database/entities/user.entity';

export class CreateDetailReqDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'mood',
    example: 'sad',
    maxLength: 50,
    pattern: `/^[a-zA-Z0-9]*$/`,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'mood can only contain letters and numbers',
  })
  mood: string;

  @ApiProperty({
    type: 'int',
    required: true,
    description: 'budget',
    example: 1000,
  })
  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'date',
    example: '2024',
    maxLength: 200,
    pattern: `/^[a-zA-Z0-9]*$/`,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'date can only contain letters and numbers',
  })
  date: string;

  user: UserEntity;
  plan: PlanEntity;
}

export class UpdateDetailReqDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'mood',
    example: 'sad',
    maxLength: 50,
    pattern: `/^[a-zA-Z0-9]*$/`,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'mood can only contain letters and numbers',
  })
  mood: string;

  @ApiProperty({
    type: 'int',
    required: true,
    description: 'budget',
    example: 1000,
  })
  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'date',
    example: '2024',
    maxLength: 200,
    pattern: `/^[a-zA-Z0-9]*$/`,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'date can only contain letters and numbers',
  })
  date: string;
}

export type DetailRelations = 'plan' | 'user';
