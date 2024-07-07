import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'src/env';

interface EmailVerificationPayload {
  email: string;
  iat: number;
  exp: number;
}

export class EmailVerificationStrategy extends PassportStrategy(
  Strategy,
  'email',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: env.EMAIL_VERIFICATION_SECRET,
    });
  }

  async validate(payload: EmailVerificationPayload) {
    const { email } = payload;
    return email;
  }
}
