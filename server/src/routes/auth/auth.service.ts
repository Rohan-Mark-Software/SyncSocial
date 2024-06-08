import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/database/entities/user.entity';
import { compare } from 'bcrypt';
// import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async logIn(user: UserEntity) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async localValidation(
    localId: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findOneByLocalId(localId);
    if (user) {
      const match = await compare(password, user.password);
      if (match) return user;
    }
    return null;
  }

  async generateAccessToken(user: UserEntity): Promise<string> {
    const newTokenVersion = (user.accessTokenVersion + 1) % 10;
    // get plans and put it in
    await this.userService.update(user.id, {
      accessTokenVersion: newTokenVersion,
    });
    return await this.jwtService.signAsync(
      {
        id: user.id,
        username: user.username,
        tokenVersion: newTokenVersion,
        type: 'access',
        emailConfirmed: user.emailConfirmed,
      },
      {
        expiresIn: '1h',
      },
    );
  }

  async generateRefreshToken(user: UserEntity): Promise<string> {
    const newTokenVersion = (user.refreshTokenVersion + 1) % 10;
    await this.userService.update(user.id, {
      refreshTokenVersion: newTokenVersion,
    });
    return await this.jwtService.signAsync(
      {
        id: user.id,
        username: user.username,
        tokenVersion: newTokenVersion,
        type: 'refresh',
        emailConfirmed: user.emailConfirmed,
      },
      {
        expiresIn: '7d',
      },
    );
  }

  async validateToken(token: string) {
    try {
      const result = await this.jwtService.verifyAsync(token);
      return result;
    } catch (error) {
      throw new BadRequestException('token expired');
    }
  }
}
