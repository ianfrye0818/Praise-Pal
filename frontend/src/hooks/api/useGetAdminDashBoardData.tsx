import { useAuth } from '../useAuth';
import { Role } from '@/types';
import { QueryKeys } from '@/constants';
import { useQueries } from '@tanstack/react-query';
import { getCompany, getCompanyKudos, getCompanyUsers } from '@/api/api-handlers';

export default function useGetAdminDashBoardData(limit: number = 10) {
  const { user } = useAuth().state;
  const companyId = user?.companyId as string;

  const results = useQueries({
    queries: [
      {
        queryKey: QueryKeys.company,
        queryFn: async () => await getCompany(companyId),
        enabled: !!companyId,
      },
      {
        queryKey: QueryKeys.limitUsers(limit),
        queryFn: async () =>
          await getCompanyUsers({
            companyId,
            roles: [Role.USER, Role.ADMIN, Role.COMPANY_OWNER],
            limit: 10,
          }),
        enabled: !!companyId,
      },
      {
        queryKey: QueryKeys.limitKudos(limit),
        queryFn: async () => await getCompanyKudos({ companyId, limit }),
      },
    ],
  });

  const [companyResult, usersResult, kudosResult] = results;

  if (usersResult.isError || kudosResult.isError || companyResult.isError) {
    console.log({
      userError: usersResult.error,
      kudosError: kudosResult.error,
      companyError: companyResult.error,
    });
  }

  return {
    company: companyResult.data,
    users: usersResult.data,
    kudos: kudosResult.data,
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
