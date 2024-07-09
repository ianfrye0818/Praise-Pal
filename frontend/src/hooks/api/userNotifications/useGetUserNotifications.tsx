import { getUserNotifications } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { UserNotificationQueryParams } from '@/types';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useGetUserNotifications(
  queryParams?: UserNotificationQueryParams,
  queryKey: QueryKey = QueryKeys.userNotifications
) {
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      return await getUserNotifications(queryParams);
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });
  return query;
}
