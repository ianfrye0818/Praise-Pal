import useGetUserNotifications from '@/hooks/api/userNotifications/useGetUserNotifications';
import { useAuth } from '@/hooks/useAuth';
import { getUserDisplayName } from '@/lib/utils';
import { ActionTypes, UserNotification } from '@/types';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_rootLayout/notifications')({
  component: () => <UserNotificationsPage />,
});

function UserNotificationsPage() {
  const { user } = useAuth().state;
  const { data: notifications, isError, isLoading } = useGetUserNotifications();

  //TODO implement loading and error screens
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!notifications) {
    return <div>You're all caught up on your notifications!</div>;
  }
  const displayName = getUserDisplayName(user!);
  return (
    <div>
      <h1>Welcome, {displayName}</h1>
      <div className='flex flex-col gap-4 p-6'>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            {...notification}
          />
        ))}
      </div>
    </div>
  );
}

function NotificationCard(notification: UserNotification) {
  return (
    <div className='px-2 py-4 flex flex-col justify-center border shadow-sm rounded-md'>
      <p className=''>
        {getNotificationIcon(notification.actionType)} {notification.message}
      </p>
    </div>
  );
}

function getNotificationIcon(type: ActionTypes) {
  switch (type) {
    case ActionTypes.KUDOS:
      return '👏';
    case ActionTypes.COMMENT:
      return '💬';
    case ActionTypes.LIKE:
      return '👍';
  }
}
