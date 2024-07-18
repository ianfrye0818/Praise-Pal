import { patchRestoreUser } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
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
  const mutation = useMutation({
    mutationFn: async ({ companyCode, userId }: UseGetUserProps) =>
      await patchRestoreUser(companyCode, userId),

    onSuccess: () => {
      queryClient.invalidateQueries(USER_QUERY_OPTIONS);
    },
  });
  return mutation;
}
