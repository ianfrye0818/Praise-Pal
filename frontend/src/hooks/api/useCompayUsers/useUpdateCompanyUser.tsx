import { patchUpdateUser } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { Role, UpdateUserProps, User } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseUpdateCuurentUserProps {
  userToUpdateId: string;
  companyCode: string;
  payload: UpdateUserProps;
  currentUser: User;
}

export default function useUpdateCompanyUser({
  queryKey = QueryKeys.allUsers,
}: { queryKey?: QueryKey } = {}) {
  const USER_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();

  const mutation = useMutation({
    mutationFn: async ({
      companyCode,
      userToUpdateId,
      payload,
      currentUser,
    }: UseUpdateCuurentUserProps) => {
      if (currentUser.userId === userToUpdateId) {
        throw new Error('Please click the avitar icon in the sidebar to update your account');
      }

      // const { companyCode: code, role, createdAt: _, updatedAt: __, ...rest } = payload;
      const { role, companyCode: code, ...rest } = payload;

      const sendingPayload =
        currentUser.role === Role.COMPANY_OWNER ? { ...rest, code, role } : rest;

      return await patchUpdateUser(companyCode, userToUpdateId, sendingPayload);
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
