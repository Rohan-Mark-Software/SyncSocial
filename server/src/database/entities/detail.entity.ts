import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlanEntity } from './plan.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'detail' })
export class DetailEntity {
  @ApiProperty({
    description: 'The unique identifier for the detail',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'Mood',
    example: 'sad',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'No content',
  })
  mood: string;

  @ApiProperty({
    description: 'budget',
    example: '100000',
  })
  @Column({
    type: 'integer',
    nullable: false,
  })
  budget: number;

  @ApiProperty({
    description: 'date and time',
    example: '2024.05.06 to 2024.05.14',
  })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  date: string;

  @ApiProperty({
    description: 'The user that this detail belongs',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.details, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ApiProperty({
    description: 'The plan that this detail belongs',
    type: () => PlanEntity,
  })
  @ManyToOne(() => PlanEntity, (plan) => plan.details, { onDelete: 'CASCADE' })
  @JoinColumn()
  plan: PlanEntity;
}
