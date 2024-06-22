import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ClientUser } from 'src/types';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ClientUser;

    if (user.role !== Role.SUPER_ADMIN) {
      throw new UnauthorizedException(
        'Only Super Admin can perform this action',
      );
    }
    return true;
  }
}
