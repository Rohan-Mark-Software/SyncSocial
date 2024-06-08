import { ApiProperty } from '@nestjs/swagger';
import { UserRole, VerificationMethod } from 'src/common/data-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PlanEntity } from './plan.entity';
import { UnsentMessageEntity } from './unsend-message.entity';
import { MessageEntity } from './message.entity';
import { DetailEntity } from './detail.entity';

@Entity({ name: 'user' })
@Unique(['verificationMethod', 'verificationValue'])
export class UserEntity {
  @ApiProperty({
    description: 'The unique identifier for the user',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'NoName',
    unique: false,
  })
  username: string;

  @ApiProperty({
    description: 'The verification method used by the user',
    enum: VerificationMethod,
    enumName: 'VerificationMethod',
    default: VerificationMethod.LOCAL,
  })
  @Column({
    type: 'enum',
    enum: VerificationMethod,
    default: VerificationMethod.LOCAL,
    update: false,
  })
  verificationMethod: VerificationMethod;

  @ApiProperty({
    description: 'The value used for verification',
    example: 'abc123',
  })
  @Column({
    nullable: false,
    update: false,
  })
  verificationValue: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@example.com',
  })
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
    update: false,
  })
  email: string;

  @ApiProperty({
    description: 'The hashed password of the user',
    example: '$2b$10$Nc.sRi/k4bYt5g2/.aS.KeIiC0j7lgBHcXGZDkVQ5ydFp4vcA40TG',
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  password: string;

  @ApiProperty({
    description: 'The version of the access token',
    example: 0,
  })
  @Column({
    type: 'int2',
    nullable: false,
    default: 0,
  })
  accessTokenVersion: number;

  @ApiProperty({
    description: 'The version of the refresh token',
    example: 0,
  })
  @Column({
    type: 'int2',
    nullable: false,
    default: 0,
  })
  refreshTokenVersion: number;

  @ApiProperty({
    description: "Indicates if the user's email is confirmed",
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  emailConfirmed: boolean;

  @ApiProperty({
    description: 'The token used for email verification',
    example: 'zDHRCTWneA',
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  emailVerificationToken: string;

  @ApiProperty({
    description: 'The token used for password reset',
    example: 'zDHRCTWneA',
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  passwordResetToken: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    enumName: 'UserRole',
    default: UserRole.USER,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role',
    default: UserRole.USER,
    update: false,
  })
  role: UserRole;

  @ApiProperty({
    description: 'The date and time when the user account was created',
    example: '2023-05-29T12:34:56Z',
  })
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The plans of the user',
    type: () => PlanEntity,
    isArray: true,
  })
  @ManyToMany('PlanEntity', 'users', {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinTable()
  plans: PlanEntity[];

  @ApiProperty({
    description: 'The unsent messages to the user',
    type: () => UnsentMessageEntity,
    isArray: true,
  })
  @ManyToMany('UnsentMessageEntity', 'users', {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinTable()
  unsent_messages: UnsentMessageEntity[];

  @ApiProperty({
    description: 'The messages that sent by the user',
    type: () => MessageEntity,
    isArray: true,
  })
  @OneToMany(() => MessageEntity, (message) => message.user, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  messages: MessageEntity[];

  @ApiProperty({
    description: 'The details of user',
    type: () => DetailEntity,
    isArray: true,
  })
  @OneToMany(() => DetailEntity, (detail) => detail.user, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  details: DetailEntity[];
}
