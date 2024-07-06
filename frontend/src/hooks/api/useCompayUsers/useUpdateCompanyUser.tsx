import { patchUpdateUser } from '@/api/api-handlers';
import { updateCurrentUser } from '@/api/auth-actions';
import { USER_QUERY_OPTIONS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { Role, User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseGetUserProps {
  userToUpdateId: string;
  companyId: string;
  payload: Partial<User>;
  currentUser: User;
}

export default function useUpdateCompanyUser() {
  const { dispatch } = useAuth();
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const mutation = useMutation({
    mutationFn: async ({ companyId, userToUpdateId, payload, currentUser }: UseGetUserProps) => {
      if (userToUpdateId === currentUser.userId) {
        return await updateCurrentUser(dispatch, companyId, userToUpdateId, payload);
      } else {
        const { role: _, ...rest } = payload;
        return await patchUpdateUser(
          companyId,
          userToUpdateId,
          currentUser.role === Role.COMPANY_OWNER ? payload : rest
        );
      }
    },
    onMutate: async (newData: Partial<User>) => {
      await queryClient.cancelQueries(USER_QUERY_OPTIONS);

      const previousData = queryClient.getQueriesData(USER_QUERY_OPTIONS);

      queryClient.setQueriesData(USER_QUERY_OPTIONS, (old: any) => {
        return old.map((user: User) => {
          if (user.userId === newData.userId) {
            return {
              ...user,
              ...newData,
            };
          }
          return user;
        });
      });
      return { previousData };
    },
    onError: (err, __, context) => {
      queryClient.setQueriesData(USER_QUERY_OPTIONS, context?.previousData);
      errorToast({ message: err.message });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(USER_QUERY_OPTIONS);
      successToast({ message: 'User updated successfully' });
    },
  });
  return mutation;
}
