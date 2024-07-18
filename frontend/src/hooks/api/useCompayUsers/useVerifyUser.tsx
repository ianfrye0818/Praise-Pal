import { postVerifyUser } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useVerifyUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ companyCode, userId }: { companyCode: string; userId: string }) => {
      return await postVerifyUser(companyCode, userId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.allUsers });
    },
  });

  return mutation;
}
