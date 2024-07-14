import { deleteSingleUser } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useSuccessToast from '@/hooks/useSuccessToast';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseGetUserProps {
  userId: string;
  companyCode: string;
}

export default function useDeleteCompanyUser({
  queryKey = QueryKeys.allUsers,
}: { queryKey?: QueryKey } = {}) {
  const USER_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { successToast } = useSuccessToast();
  const mutation = useMutation({
    mutationFn: async ({ companyCode, userId }: UseGetUserProps) =>
      await deleteSingleUser(companyCode, userId),

    onSuccess: () => {
      queryClient.invalidateQueries(USER_QUERY_OPTIONS);
      successToast({ message: 'User deleted successfully' });
    },
  });
  return mutation;
}
