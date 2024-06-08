import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import { DetailEntity } from './detail.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'plan' })
export class PlanEntity {
  @ApiProperty({
    description: 'The unique identifier for the plan',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'name of the plan',
    example: 'Field trip',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'The auto generated code of the plan',
    example: 'LSasd#ksld',
  })
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  code: string;

  @ApiProperty({
    description: 'The date and time when the plan was created',
    example: '2023-05-29T12:34:56Z',
  })
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The messages that sent by the user',
    type: () => MessageEntity,
    isArray: true,
  })
  @OneToMany(() => MessageEntity, (request) => request.plan, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  messages: MessageEntity[];

  @ApiProperty({
    description: 'The details of plan',
    type: () => DetailEntity,
    isArray: true,
  })
  @OneToMany(() => DetailEntity, (request) => request.plan, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  details: DetailEntity[];

  @ApiProperty({
    description: 'The users associated with the plan',
    type: () => UserEntity,
    isArray: true,
  })
  @ManyToMany('UserEntity', 'plans')
  users: UserEntity[];
}
