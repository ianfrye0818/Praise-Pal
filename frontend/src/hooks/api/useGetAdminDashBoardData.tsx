import { useAuth } from '../useAuth';
import useGetCompanyUsers from './useCompayUsers/useGetCompanyUsers';
import { Role } from '@/types';
import useGetCompanyKudos from './useKudos/useGetCompanyKudos';
import useGetCompany from './useCompany/useGetCompany';

export default function useGetAdminDashBoardData(limit: number = 10) {
  const { user } = useAuth().state;

  const { data: users } = useGetCompanyUsers({
    companyId: user?.companyId as string,
    limit: limit,
    roles: [Role.USER, Role.ADMIN, Role.COMPANY_OWNER],
  });

  const { data: kudos } = useGetCompanyKudos({
    companyId: user?.companyId as string,
    limit: limit,
  });

  const { data: company } = useGetCompany(user?.companyId as string);

  return { company, users, kudos };
}
