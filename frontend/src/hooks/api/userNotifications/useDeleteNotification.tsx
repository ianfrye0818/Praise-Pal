import { deleteNotificationById } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { UserNotification } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteNotification({
  queryKey = QueryKeys.userNotifications,
}: { queryKey?: QueryKey } = {}) {
  const USER_NOTIFICATION_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await deleteNotificationById(notificationId);
    },
    onMutate: async (notificationId) => {
      const previousData = queryClient.getQueriesData(USER_NOTIFICATION_QUERY_OPTIONS);

      queryClient.setQueriesData(USER_NOTIFICATION_QUERY_OPTIONS, (old: any) => {
        return old.filter((notification: UserNotification) => notification.id !== notificationId);
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
