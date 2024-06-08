import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class RoomDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class MessageDto {
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  content: string;
}
