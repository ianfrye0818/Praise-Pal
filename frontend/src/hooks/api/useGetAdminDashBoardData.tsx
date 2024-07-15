import { useAuth } from '../useAuth';
import { Role } from '@/types';
import { QueryKeys } from '@/constants';
import { useQueries } from '@tanstack/react-query';
import { getCompany, getCompanyKudos, getCompanyUsers } from '@/api/api-handlers';

export default function useGetAdminDashBoardData(take: number = 10) {
  const { user } = useAuth().state;
  const companyCode = user?.companyCode as string;

  const results = useQueries({
    queries: [
      {
        queryKey: QueryKeys.company,
        queryFn: async () => await getCompany(companyCode),
        enabled: !!companyCode,
      },
      {
        queryKey: QueryKeys.limitUsers(take),
        queryFn: async () => {
          const users = await getCompanyUsers({
            companyCode,
            roles: [Role.USER, Role.ADMIN, Role.COMPANY_OWNER],
            take: 10,
          });
          if (users) {
            return users;
          } else return [];
        },
        enabled: !!companyCode,
      },
      {
        queryKey: QueryKeys.limitKudos(take),
        queryFn: async () => await getCompanyKudos({ companyCode, take }),
      },
    ],
  });

  const [companyResult, usersResult, kudosResult] = results;

  if (usersResult.isError || kudosResult.isError || companyResult.isError) {
    console.error({
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
