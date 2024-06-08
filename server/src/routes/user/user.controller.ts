import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from './dto/req.dto';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { resUserEntity, toResUserEntity } from './dto/res.dto';
import { Public } from 'src/decorator/public.decorator';
import { MailService } from '../mail/mail.service';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private mailService: MailService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<resUserEntity> {
    try {
      const user = await this.userService.create(createUserDto);
      console.log(user);
      await this.mailService.sendVerificationMail(user);
      return toResUserEntity(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List of users.' })
  async findAll(): Promise<resUserEntity[]> {
    const users = await this.userService.findAll();
    users.forEach((user) => {
      toResUserEntity(user);
    });
    return;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<resUserEntity> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return toResUserEntity(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<resUserEntity> {
    if (req.user.id !== id) {
      throw new HttpException('Not allowed', HttpStatus.FORBIDDEN);
    }
    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return toResUserEntity(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    if (req.user.id !== id) {
      throw new HttpException('Not allowed', HttpStatus.FORBIDDEN);
    }
    const result = await this.userService.remove(id);
    if (!result.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Put(':token')
  @ApiOperation({ summary: 'Update a user password' })
  @ApiResponse({
    status: 200,
    description: 'User password updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  async updatePassword(
    @Param('token') token: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req,
  ): Promise<resUserEntity> {
    if (req.user.password !== token) {
      throw new HttpException('Not allowed', HttpStatus.FORBIDDEN);
    }
    const user = await this.userService.updatePassword(
      req.user,
      updatePasswordDto.password,
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return toResUserEntity(user);
  }
}
