import { updateCurrentUser } from '@/api/auth-actions';
import { QueryKeys } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { User } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseUpdateCurrentUserProps {
  companyCode: string;
  payload: Partial<User>;
  currentUser: User;
}

export default function useUpdateCurrentUser({
  queryKey = QueryKeys.allUsers,
}: { queryKey?: QueryKey } = {}) {
  const USER_QUERY_OPTIONS = { queryKey, exact: false };
  const { dispatch } = useAuth();
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();

  const mutation = useMutation({
    mutationFn: async ({ payload, currentUser, companyCode }: UseUpdateCurrentUserProps) => {
      const { companyCode: _, role: __, createdAt: ___, updatedAt: ____, ...rest } = payload;

      return await updateCurrentUser({
        dispatch,
        companyCode,
        currentUserId: currentUser.userId,
        payload: rest,
      });
    },
    onMutate: async (newData: Partial<User>) => {
      await queryClient.cancelQueries(USER_QUERY_OPTIONS);

      const previousData = queryClient.getQueriesData(USER_QUERY_OPTIONS);

      queryClient.setQueriesData(USER_QUERY_OPTIONS, (old: any) => {
        if (Array.isArray(old)) {
          return old.map((user: User) => {
            if (user.userId === newData.userId) {
              return {
                ...user,
                ...newData,
              };
            }
            return user;
          });
        } else {
          return {
            ...old,
            ...newData,
          };
        }
      });
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueriesData(USER_QUERY_OPTIONS, context?.previousData);
      errorToast({ message: 'Something went wrong updating your account. ' });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(USER_QUERY_OPTIONS);
      successToast({ message: 'User updated successfully' });
    },
  });
  return mutation;
}
