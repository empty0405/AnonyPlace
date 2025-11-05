import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-patreon';
import { AuthService } from './auth.service';

@Injectable()
export class PatreonStrategy extends PassportStrategy(Strategy, 'patreon') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_CLIENT_SECRET,
      callbackURL: process.env.PATREON_REDIRECT_URI,
      scope: 'identity identity[email] campaigns',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const user = await this.authService.validateUser(profile);
    if (!user) {
      return done(new Error('User not found'), null);
    }
    return done(null, user);
  }
}
