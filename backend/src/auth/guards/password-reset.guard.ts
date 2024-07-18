import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/env';

@Injectable()
export class PasswordResetGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    if (!token) {
      throw new HttpException('Token is required', 400);
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: env.PASSWORD_RESET_SECRET,
      });
      request.email = payload.email;
      return true;
    } catch (error) {
      throw new HttpException('Invalid Token', 400);
    }
  }
}
