import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PlanEntity } from './plan.entity';

@Entity({ name: 'message' })
export class MessageEntity {
  @ApiProperty({
    description: 'The unique identifier for the message',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'the context of the message',
    example: 'blah blah blah...',
  })
  @Column({
    type: 'varchar',
    name: 'content',
    length: 2000,
    nullable: false,
    default: 'No content',
  })
  content: string;

  @ApiProperty({
    description: 'The date and time when the message was created',
    example: '2023-05-29T12:34:56Z',
  })
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The user who sent the message',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ApiProperty({
    description: 'The plan that this message is to',
    type: () => PlanEntity,
  })
  @ManyToOne(() => PlanEntity, (plan) => plan.messages, { onDelete: 'CASCADE' })
  @JoinColumn()
  plan: PlanEntity;
}
