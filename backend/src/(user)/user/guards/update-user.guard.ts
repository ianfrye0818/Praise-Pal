import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserService } from '../user.service';
import { ClientUser } from 'src/types';

@Injectable()
export class UpdateUserGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtUser = request.user as ClientUser;
    const data = request.body;

    // Super admin can do anything
    if (jwtUser.role === Role.SUPER_ADMIN) {
      return true;
    }

    const companyId = request.params.companyId || request.query.companyId;
    const userId = request.params.id || request.query.userId;

    // Company owner can update anything in their company except their own role
    if (
      jwtUser.role === Role.COMPANY_OWNER &&
      jwtUser.companyId === companyId
    ) {
      if (jwtUser.userId !== userId) {
        return true;
      } else if (!data.role) {
        return true;
      } else {
        throw new ForbiddenException('You cannot update your own role');
      }
    }

    // No one can except company_owner can update roles
    if (data.role) {
      throw new ForbiddenException('You cannot update roles');
    }

    // Company admin can update user info except roles
    if (jwtUser.role === Role.ADMIN && jwtUser.companyId === companyId) {
      return true;
    }

    // Users can update their own info
    if (jwtUser.userId === userId) {
      return true;
    }

    throw new ForbiddenException('You are not allowed to update this user');
  }
}
