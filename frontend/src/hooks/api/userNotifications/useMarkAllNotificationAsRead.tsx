import { patchMarkAllNotificationAsRead } from '@/api/api-handlers';
import { USER_NOTIFICATION_QUERY_OPTIONS } from '@/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      await patchMarkAllNotificationAsRead();
    },
    onMutate: async () => {
      const previousData = queryClient.getQueriesData(USER_NOTIFICATION_QUERY_OPTIONS);

      queryClient.setQueriesData(USER_NOTIFICATION_QUERY_OPTIONS, (old: any) => {
        return old.map(() => {
          return { ...old, isRead: true };
        });
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueriesData(USER_NOTIFICATION_QUERY_OPTIONS, context?.previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(USER_NOTIFICATION_QUERY_OPTIONS);
    },
  });

  return mutation;
}
