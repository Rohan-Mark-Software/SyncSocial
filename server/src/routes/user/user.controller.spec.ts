import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/req.dto';
import { UserRole, VerificationMethod } from 'src/common/data-types';
import { resUserEntity } from './dto/res.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'john_doe',
        verificationValue: 'abc123',
        email: 'john@example.com',
        password: 'password',
      };

      const result = {
        id: '1',
        ...createUserDto,
        createdAt: new Date(),
        plans: [],
        unsent_messages: [],
        messages: [],
        details: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(result as UserEntity);

      expect(await controller.create(createUserDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const serviceResult: UserEntity[] = [
        {
          id: '1',
          username: 'john_doe',
          verificationMethod: VerificationMethod.LOCAL,
          verificationValue: 'abc123',
          email: 'john@example.com',
          password: 'password',
          accessTokenVersion: 0,
          refreshTokenVersion: 0,
          emailConfirmed: false,
          role: UserRole.USER,
          createdAt: new Date(),
          plans: [],
          unsent_messages: [],
          messages: [],
          details: [],
          emailVerificationToken: '',
          passwordResetToken: '',
        },
      ];

      const result: resUserEntity[] = [
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          accessTokenVersion: 0,
          refreshTokenVersion: 0,
          emailConfirmed: false,
          createdAt: 'date',
          plans: [],
          unsent_messages: [],
          messages: [],
          details: [],
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(serviceResult);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const serviceResult: UserEntity = {
        id: '1',
        username: 'john_doe',
        verificationMethod: VerificationMethod.LOCAL,
        verificationValue: 'abc123',
        email: 'john@example.com',
        password: 'password',
        accessTokenVersion: 0,
        refreshTokenVersion: 0,
        emailConfirmed: false,
        role: UserRole.USER,
        createdAt: new Date(),
        plans: [],
        unsent_messages: [],
        messages: [],
        details: [],
        emailVerificationToken: '',
        passwordResetToken: '',
      };
      const result: resUserEntity = {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        accessTokenVersion: 0,
        refreshTokenVersion: 0,
        emailConfirmed: false,
        createdAt: 'date',
        plans: [],
        unsent_messages: [],
        messages: [],
        details: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(serviceResult);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'john_doe_updated',
      };

      const result = {
        ...updateUserDto,
        id: '1',
        verificationMethod: 'LOCAL',
        verificationValue: 'abc123',
        password: 'password',
        accessTokenVersion: 0,
        refreshTokenVersion: 0,
        emailConfirmed: false,
        role: 'USER',
        createdAt: new Date(),
        plans: [],
        unsent_messages: [],
        messages: [],
        details: [],
      };

      jest.spyOn(service, 'update').mockResolvedValue(result as UserEntity);

      expect(await controller.update('1', updateUserDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = { affected: 1 };

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
    });
  });
});
