import { createErrorLog } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { CustomError } from '@/errors';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreateErrorLog() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ error, userId }: { userId: string; error: Error | CustomError }) => {
      return await createErrorLog({
        userId,
        message: error.message,
        stack: error.stack ?? '',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QueryKeys.allErrorLogs });
    },
  });
  return mutation;
}
