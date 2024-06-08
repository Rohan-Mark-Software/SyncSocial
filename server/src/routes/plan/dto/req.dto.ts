import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class JoinPlanReqDto {
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

export class CreatePlanReqDto extends JoinPlanReqDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'name of the plan',
    example: 'fieldtrip',
    maxLength: 50,
    pattern: `/^[a-zA-Z0-9]*$/`,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'name can only contain letters and numbers',
  })
  name: string;
}

export type PlanRelations = 'users' | 'details' | 'messages';
