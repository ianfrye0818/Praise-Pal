import { getUserNotifications } from '@/api/api-handlers';
import { UserNotificationQueryParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export default function useGetUserNotifications(queryParams?: UserNotificationQueryParams) {
  const query = useQuery({
    queryKey: ['userNotifications', queryParams],
    queryFn: async () => {
      return await getUserNotifications(queryParams);
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });
  return query;
}
