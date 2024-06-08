import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Login with Local auth',
    description:
      'it requires local id and password to login and returns jwt tokens',
  })
  @ApiBody({
    description: 'User id and password',
    schema: {
      type: 'object',
      properties: {
        localId: {
          type: 'string',
          description: 'Users local ID',
          example: 'MarkNam2011',
        },
        password: {
          type: 'string',
          description: 'Users password',
          example: 'Dragon1234@!!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Users accessToken and refreshToken',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'access token',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzNjU0NmU1LTM5MWItNGE4Yi1hYWM3LWUzYzgxMWNhYWJhNyIsInVzZXJuYW1lIjoiTWFya05hbXRlc3RpbmczMSIsInRva2VuVmVyc2lvbiI6NiwidHlwZSI6ImFjY2VzcyIsImVtYWlsQ29uZmlybWVkIjp0cnVlLCJpYXQiOjE3MTY5ODk3NDUsImV4cCI6MTcxNjk5MTU0NX0.o9s8aFbqmgcL6yS5nUkl8Xe6hcgnSVmL4WuQeEWkIM4',
        },
        refreshToken: {
          type: 'string',
          description: 'refresh token',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzNjU0NmU1LTM5MWItNGE4Yi1hYWM3LWUzYzgxMWNhYWJhNyIsInVzZXJuYW1lIjoiTWFya05hbXRlc3RpbmczMSIsInRva2VuVmVyc2lvbiI6NiwidHlwZSI6InJlZnJlc2giLCJlbWFpbENvbmZpcm1lZCI6dHJ1ZSwiaWF0IjoxNzE2OTg5NzQ1LCJleHAiOjE3MTc1OTQ1NDV9.nxYYTLxaOwjW0el7eb7nb7uAh3srslJ6yAR2HaHLt5E',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('logIn')
  async logIn(@Request() req) {
    return await this.authService.logIn(req.user);
  }
}
