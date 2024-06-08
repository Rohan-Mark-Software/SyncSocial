import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum VerificationMethod {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export type tokenType = [string, string];

export class TokenPayload {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'users id, UUID v4',
    example: '336546e5-391b-4a8b-aac7-e3c811caaba7',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Username, max 50, min 1, only contains letters and numbers',
    example: 'MarkNam2011',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'users id for logging in',
    example: 'MarkNam2011',
  })
  userId: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'version of the token, from 0 to 9',
    example: 1,
  })
  tokenVersion: number;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'it is either access or refresh',
    example: 'access',
  })
  type: tokenType;
}
