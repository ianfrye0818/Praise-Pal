import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Link } from '@tanstack/react-router';
import { ActionTypes, UserNotification } from '@/types';
import { getNotificationIcon } from '@/lib/getNotificationIcons';
import { cn } from '@/lib/utils';
import useMarkSingleNotificationAsRead from '@/hooks/api/userNotifications/useMarkSingleNotificationAsRead';

export default function NotificationsDropDown({
  children,
  notifications,
}: {
  children?: React.ReactNode;
  notifications?: UserNotification[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger>
        <div className='relative'>{children}</div>
      </PopoverTrigger>
      {
        <PopoverContent
          side='bottom'
          sideOffset={15}
          className=' bg-white flex flex-col gap-4 max-w-screen-sm w-[300px] shadow-md rounded-md p-2'
        >
          <ScrollArea>
            <div className='flex flex-col gap-2 h-[250px]'>
              {notifications && notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    setOpen={setOpen}
                  />
                ))
              ) : (
                <div className='h-full flex justify-center items-center'>🎉 No Notifications</div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      }
    </Popover>
  );
}

function NotificationCard({
  notification,
  setOpen,
}: {
  notification: UserNotification;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mutateAsync: markAsRead } = useMarkSingleNotificationAsRead();
  const notificationLink =
    notification.actionType === ActionTypes.NEW_USER
      ? '/admin/verify-user/$token'
      : '/kudos/$kudosId';
  const notificationParams =
    notification.actionType === ActionTypes.NEW_USER
      ? { token: notification.newUserId }
      : { kudosId: notification.kudosId };

  return (
    <div
      className={cn(
        'px-2 py-4 flex flex-col justify-center border rounded-md',
        !notification.isRead && 'bg-gray-50 shadow-none'
      )}
    >
      <Link
        onClick={async () => {
          await markAsRead(notification.id);
          setOpen(false);
        }}
        to={notificationLink}
        params={notificationParams as any}
        className=''
      >
        <div className='flex gap-2'>
          {getNotificationIcon(notification.actionType)} {notification.message}
        </div>
      </Link>
    </div>
  );
}
