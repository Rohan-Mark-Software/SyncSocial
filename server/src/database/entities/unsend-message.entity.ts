import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'unsent-message' })
export class UnsentMessageEntity {
  @ApiProperty({
    description: 'The unique identifier for the unsent message',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'The message',
    type: () => MessageEntity,
  })
  @OneToOne(() => MessageEntity)
  @JoinColumn()
  message: MessageEntity;

  @ApiProperty({
    description: 'The users that have not received the message',
    type: () => UserEntity,
    isArray: true,
  })
  @ManyToMany('UserEntity', 'unsent_messages')
  users: UserEntity[];
}
