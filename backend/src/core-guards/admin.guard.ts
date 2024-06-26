import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ClientUser } from '../types';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user as ClientUser;
    if (!user)
      throw new UnauthorizedException(
        'Must be logged in to access this resource',
      );

    if (user.role === Role.SUPER_ADMIN) return true;

    const companyId = request.params.companyId || request.query.companyId;

    if (user.role === Role.ADMIN && user.companyId === companyId) return true;

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
