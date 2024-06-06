import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { KudosService } from 'src/kudos/kudos.service';
import { JWTUser, Role } from 'src/types';

@Injectable()
export class EditKudosGuard implements CanActivate {
  constructor(private kudosService: KudosService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtUser = request.user as JWTUser;

    if (jwtUser.role === Role.SUPER_ADMIN) return true;

    const companyId = request.params.companyId;

    if (jwtUser.role === Role.ADMIN && jwtUser.companyId === companyId)
      return true;

    const kudoId = request.params.kudosId;

    const kudo = await this.kudosService.getKudoById(kudoId);

    if (kudo.senderId === jwtUser.userId) return true;

    throw new ForbiddenException('You are not allowed to update this kudos');
  }
}