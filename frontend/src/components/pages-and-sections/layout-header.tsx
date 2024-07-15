import useGetUserNotifications from '@/hooks/api/userNotifications/useGetUserNotifications';
import { Avatar, AvatarFallback } from '../ui/avatar';
import NotificationsDropDown from '../dialogs-and-menus/notifications-dropdown';
import { BellIcon } from 'lucide-react';
import AddKudosDialog from '../dialogs-and-menus/add-kudos-dialog';
import { Button } from '../ui/button';

export default function Header({ showAddKudos = true }: { showAddKudos?: boolean }) {
  const { data: notifications } = useGetUserNotifications();
  const unreadLength = notifications?.filter((n) => !n.isRead).length || 0;
  const showNotifcationAmount = notifications && unreadLength > 0;

  return (
    <header className='flex md:px-4 p-6 md:py-3 items-center justify-end'>
      <div className='ml-auto flex gap-4 items-center'>
        <div className='relative'>
          <Avatar>
            <AvatarFallback className='bg-midnightGreen'>
              <NotificationsDropDown notifications={notifications || []}>
                <BellIcon />
              </NotificationsDropDown>
            </AvatarFallback>
          </Avatar>
          {showNotifcationAmount && (
            <div className='absolute -top-2 -right-2 p-2 w-6 h-6 flex items-center justify-center rounded-full bg-destructive text-primary-foreground'>
              {unreadLength}
            </div>
          )}
        </div>
        {showAddKudos && (
          <AddKudosDialog>
            <Button>Add Kudos</Button>
          </AddKudosDialog>
        )}
      </div>
    </header>
  );
}
