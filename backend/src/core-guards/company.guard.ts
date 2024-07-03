import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserService } from '../(user)/user/user.service';
import { ClientUser } from '../types';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ClientUser;

    if (!user) {
      throw new UnauthorizedException(
        'Must be logged in to access this resource',
      );
    }

    const companyId = request.params.companyId || request.query.companyId;
    if (!companyId) {
      throw new HttpException('Company ID is required', 400);
    }
    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    if (user.companyId === companyId) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
