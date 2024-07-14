import { patchRestoreUser } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import { User } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseGetUserProps {
  userId: string;
  companyCode: string;
}

export default function useRestoreCompanyUser({
  queryKey = QueryKeys.allUsers,
}: { queryKey?: QueryKey } = {}) {
  const USER_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();
  const mutation = useMutation({
    mutationFn: async ({ companyCode, userId }: UseGetUserProps) =>
      await patchRestoreUser(companyCode, userId),

    onMutate: async (newData: Partial<User>) => {
      await queryClient.cancelQueries(USER_QUERY_OPTIONS);

      const previousData = queryClient.getQueryData(['companyUsers']);

      queryClient.setQueriesData(USER_QUERY_OPTIONS, (old: any) => {
        return old.map((user: User) => {
          user.userId === newData.userId ? { ...user, deletedAt: null } : user;
        });
      });
      return { previousData };
    },
    onError: (err, __, context) => {
      console.error(['useDeleteCompanyUser'], err, context);
      queryClient.setQueriesData(USER_QUERY_OPTIONS, context?.previousData);
      errorToast({
        message:
          'Something went wrong restoring user. If this happens again, please contact your administrator',
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(USER_QUERY_OPTIONS);
    },
  });
  return mutation;
}
