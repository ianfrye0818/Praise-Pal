import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Link } from '@tanstack/react-router';
import useMarkAllNotificationsAsRead from '@/hooks/api/userNotifications/useMarkAllNotificationAsRead';
import { UserNotification } from '@/types';
import { getNotificationIcon } from '@/lib/getNotificationIcons';

export default function NotificationsDropDown({
  children,
  notifications,
}: {
  children?: React.ReactNode;
  notifications?: UserNotification[];
}) {
  const [open, setOpen] = useState(false);
  const canPerformActions = notifications && notifications?.length > 0;

  const { mutateAsync: markAllAsRead } = useMarkAllNotificationsAsRead();

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        canPerformActions ? setOpen(open) : setOpen(false);
      }}
    >
      <PopoverTrigger onClick={canPerformActions ? async () => markAllAsRead() : undefined}>
        <div className='relative'>{children}</div>
      </PopoverTrigger>
      {notifications && (
        <PopoverContent
          side='bottom'
          sideOffset={15}
          className=' bg-white flex flex-col gap-4'
        >
          <ScrollArea>
            <div className='flex flex-col gap-2 h-[250px]'>
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  setOpen={setOpen}
                />
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      )}
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
  return (
    <div className='px-2 py-4 flex flex-col justify-center border shadow-sm rounded-md'>
      <Link
        onClick={() => setOpen(false)}
        to='/kudos/$kudosId'
        params={{ kudosId: notification.kudosId }}
        className=''
      >
        <div className='flex gap-2'>
          {getNotificationIcon(notification.actionType)} {notification.message}
        </div>
      </Link>
    </div>
  );
}
