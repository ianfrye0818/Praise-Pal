import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { ActionTypes, UserNotification } from '@/types';
import { Link } from '@tanstack/react-router';
import useMarkAllNotificationsAsRead from '@/hooks/api/userNotifications/useMarkAllNotificationAsRead';
import { FcLike } from 'react-icons/fc';

import { FaComments } from 'react-icons/fa';
import { MdCelebration } from 'react-icons/md';

export default function NotificationsDropDown({
  children,
  notifications,
}: {
  children: React.ReactNode;
  notifications?: UserNotification[];
}) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: markAllAsRead } = useMarkAllNotificationsAsRead();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <Popover
      open={open}
      onOpenChange={(open) => setOpen(open)}
    >
      <PopoverTrigger onClick={async () => markAllAsRead()}>
        <div className='relative'>{children} </div>
      </PopoverTrigger>
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
        params={{ kudosId: notification.referenceId }}
        className=''
      >
        <div className='flex gap-2'>
          {getNotificationIcon(notification.actionType)} {notification.message}
        </div>
      </Link>
    </div>
  );
}

function getNotificationIcon(type: ActionTypes) {
  const classNames = 'w-6 h-6';
  switch (type) {
    case ActionTypes.KUDOS:
      return <MdCelebration className={`text-yellow-600 ${classNames}`} />;
    case ActionTypes.COMMENT:
      return <FaComments className={` text-green-500 ${classNames}`} />;
    case ActionTypes.LIKE:
      return <FcLike className={`${classNames}`} />;
  }
}
