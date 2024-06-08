import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/req.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: '1',
        ...user,
        createdAt: new Date(),
      }),
    ),
    find: jest.fn().mockResolvedValue([
      {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        accessTokenVersion: 0,
        refreshTokenVersion: 0,
        emailConfirmed: false,
        createdAt: new Date(),
      },
    ]),
    findOne: jest.fn().mockImplementation(({ where: { id } }) =>
      Promise.resolve(
        id === '1'
          ? {
              id: '1',
              username: 'testuser',
              email: 'test@example.com',
              accessTokenVersion: 0,
              refreshTokenVersion: 0,
              emailConfirmed: false,
              createdAt: new Date(),
            }
          : undefined,
      ),
    ),
    update: jest.fn().mockImplementation((id, dto) =>
      Promise.resolve({
        id,
        ...dto,
        createdAt: new Date(),
      }),
    ),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      verificationValue: 'test123',
      email: 'test@example.com',
      password: 'password',
    };
    const result = await service.create(createUserDto);
    expect(result).toEqual({
      id: expect.any(String),
      ...createUserDto,
      createdAt: expect.any(Date),
    });
    expect(repository.create).toHaveBeenCalledWith(createUserDto);
    expect(repository.save).toHaveBeenCalledWith(createUserDto);
  });

  it('should find all users', async () => {
    const result = await service.findAll();
    expect(result).toEqual([
      {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        accessTokenVersion: 0,
        refreshTokenVersion: 0,
        emailConfirmed: false,
        createdAt: expect.any(Date),
      },
    ]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find a user by ID', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual({
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      accessTokenVersion: 0,
      refreshTokenVersion: 0,
      emailConfirmed: false,
      createdAt: expect.any(Date),
    });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      username: 'updateduser',
      password: 'newpassword',
    };
    const result = await service.update('1', updateUserDto);
    expect(result).toEqual({
      id: '1',
      ...updateUserDto,
      createdAt: expect.any(Date),
    });
    expect(repository.update).toHaveBeenCalledWith('1', updateUserDto);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should remove a user', async () => {
    const result = await service.remove('1');
    expect(result).toEqual({ affected: 1 });
    expect(repository.delete).toHaveBeenCalledWith('1');
  });
});
