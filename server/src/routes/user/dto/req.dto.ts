import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Username, max 50, min 1, only contains letters and numbers',
    example: 'MarkNam2011',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'Username can only contain letters and numbers',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'User Id , max 50, min 1, only contains letters and numbers',
    example: 'MarkNam2011',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'ID can only contain letters and numbers',
  })
  verificationValue: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description:
      'users password, password must be Minimum eight and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    example: 'Dragon1234@!!',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'password must be Minimum eight and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description:
      'new username, max 50, min 1, only contains letters and numbers',
    example: 'MarkNam2011',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'Username can only contain letters and numbers',
  })
  username: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description:
      'users password, password must be Minimum eight and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    example: 'Dragon1234@!!',
  })
  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'password must be Minimum eight and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;
}

export class ServerUpdateUser {
  username?: string;
  email?: string;
  password?: string;
  accessTokenVersion?: number;
  refreshTokenVersion?: number;
  emailConfirmed?: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
}

export type UserRelations =
  | 'details'
  | 'messages'
  | 'plans'
  | 'unsent_messages';
