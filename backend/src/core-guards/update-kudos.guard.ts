import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { KudosService } from '../kudos/kudos.service';
import { ClientUser } from '../types';

@Injectable()
export class EditKudosGuard implements CanActivate {
  constructor(private kudosService: KudosService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtUser = request.user as ClientUser;
    const method = request.method;

    if (jwtUser.role === Role.SUPER_ADMIN) return true;

    const companyId = request.params.companyId || request.query.companyId;

    if (
      (jwtUser.role === Role.ADMIN || jwtUser.role === Role.COMPANY_OWNER) &&
      jwtUser.companyId === companyId
    ) {
      return true;
    }

    const kudoId = request.params.kudosId || request.query.kudosId;

    const kudo = await this.kudosService.getKudoById(kudoId);

    if (!kudo) {
      throw new ForbiddenException('Kudos not found');
    }

    if (kudo.sender.userId === jwtUser.userId) return true;

    throw new ForbiddenException('You are not allowed to update this kudos');
  }
}
