import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/routes/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'localId',
    });
  }

  async validate(localId: string, password: string): Promise<any> {
    const user = await this.authService.localValidation(localId, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
