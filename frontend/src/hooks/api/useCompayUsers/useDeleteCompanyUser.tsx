import { deleteSingleUser } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { User } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseGetUserProps {
  userId: string;
  companyId: string;
}

export default function useDeleteCompanyUser({
  queryKey = QueryKeys.allUsers,
}: { queryKey?: QueryKey } = {}) {
  const USER_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const mutation = useMutation({
    mutationFn: async ({ companyId, userId }: UseGetUserProps) =>
      await deleteSingleUser(companyId, userId),
    //optimistic update
    onMutate: async (newData: Partial<User>) => {
      await queryClient.cancelQueries(USER_QUERY_OPTIONS);

      const previousData = queryClient.getQueryData(['companyUsers']);

      queryClient.setQueriesData(USER_QUERY_OPTIONS, (old: any) => {
        return old.filter((user: User) => {
          user.userId !== newData.userId;
        });
      });
      return { previousData };
    },
    onError: (err, __, context) => {
      console.error(['useDeleteCompanyUser'], err, context);
      queryClient.setQueriesData(USER_QUERY_OPTIONS, context?.previousData);
      errorToast({
        message:
          'Something went wrong updating user. If this happens again, please contact your administrator',
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(USER_QUERY_OPTIONS);
      successToast({ message: 'User deleted successfully' });
    },
  });
  return mutation;
}
