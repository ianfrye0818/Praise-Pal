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
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ClientUser;
    if (!user) throw new UnauthorizedException();

    console.log(user);

    if (user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admin can perform this action');
    }
    return true;
  }
}
