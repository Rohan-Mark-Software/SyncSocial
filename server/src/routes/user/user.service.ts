import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, ServerUpdateUser, UserRelations } from './dto/req.dto';
import { hash } from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, verificationValue, email, password } = createUserDto;
    let user = undefined;
    user = await this.findOneByLocalId(verificationValue);
    if (user) {
      throw new BadRequestException('User with same ID already exists');
    } else {
      const encryptedPassword = await hash(
        password,
        parseInt(process.env.SALT_ROUNDS, 10),
      );
      user = await this.userRepository.save({
        username: username,
        verificationValue,
        password: encryptedPassword,
        email: email,
      });
      user = await this.generateMailVerificationToken(user);
      return user;
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(
    id: string,
    relations?: UserRelations[],
  ): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      relations: [...(relations || [])],
    });
  }

  async findOneByLocalId(id: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        verificationValue: id,
      },
    });
    return user;
  }

  async update(
    id: string,
    updateUserDto: ServerUpdateUser,
  ): Promise<UserEntity | undefined> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async updatePassword(user: UserEntity, newPassword: string) {
    const encryptedPassword = await hash(
      newPassword,
      parseInt(process.env.SALT_ROUNDS, 10),
    );
    user = await this.userRepository.save({
      password: encryptedPassword,
    });
    return user;
  }

  async updateWithUserEntity(
    user: UserEntity,
  ): Promise<UserEntity | undefined> {
    await this.userRepository.save(user);
    return this.findOne(user.id);
  }

  async remove(id: string): Promise<{ affected: number }> {
    const result = await this.userRepository.delete(id);
    return { affected: result.affected };
  }

  async generateMailVerificationToken(user: UserEntity): Promise<UserEntity> {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 10;
    let token = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, alphabet.length);
      token += alphabet.charAt(randomIndex);
    }

    user.emailVerificationToken = token;

    user = await this.updateWithUserEntity(user);
    return user;
  }

  async generateRefreshToken(user: UserEntity): Promise<UserEntity> {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 10;
    let token = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, alphabet.length);
      token += alphabet.charAt(randomIndex);
    }

    user.passwordResetToken = token;

    user = await this.updateWithUserEntity(user);
    return user;
  }
}
