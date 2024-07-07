import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/env';

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;
    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: env.EMAIL_VERIFICATION_SECRET,
      });
      request.email = payload.email;
      return true;
    } catch (error) {
      return false;
    }
  }
}
