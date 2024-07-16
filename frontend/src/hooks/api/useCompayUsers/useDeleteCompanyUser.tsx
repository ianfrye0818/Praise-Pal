import { deleteSingleUser } from '@/api/api-handlers';
import { errorLogout } from '@/api/auth-actions';
import { QueryKeys } from '@/constants';
import { CustomError } from '@/errors';
import { useAuth } from '@/hooks/useAuth';
import useSuccessToast from '@/hooks/useSuccessToast';
import { Role } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseGetUserProps {
  userId: string;
  companyCode: string;
}

export default function useDeleteCompanyUser({
  queryKey = QueryKeys.allUsers,
}: { queryKey?: QueryKey } = {}) {
  const { user: currentUser } = useAuth().state;
  const USER_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { successToast } = useSuccessToast();
  const mutation = useMutation({
    mutationFn: async ({ companyCode, userId }: UseGetUserProps) => {
      if (
        currentUser?.userId === userId &&
        (currentUser?.role === Role.SUPER_ADMIN || currentUser?.role === Role.COMPANY_OWNER)
      ) {
        throw new CustomError('This account cannot be deleted!');
      }
      await deleteSingleUser(companyCode, userId);
      if (currentUser?.userId === userId) {
        errorLogout();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(USER_QUERY_OPTIONS);
      successToast({ message: 'User deleted successfully' });
    },
  });
  return mutation;
}
