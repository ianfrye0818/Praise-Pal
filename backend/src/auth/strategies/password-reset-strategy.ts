import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'src/env';

interface EmailVerificationPayload {
  email: string;
  iat: number;
  exp: number;
}

export class PasswordResetStrategy extends PassportStrategy(
  Strategy,
  'password-reset',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: env.PASSWORD_RESET_SECRET,
    });
  }

  async validate(payload: EmailVerificationPayload) {
    const { email } = payload;
    return email;
  }
}
