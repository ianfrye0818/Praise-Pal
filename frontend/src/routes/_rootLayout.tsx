import AddKudosDialog from '@/components/dialogs/add-kudos-dialog';
import MobileNavSheet from '@/components/mobile-nav/mobile-nav-sheet';
import NotificationsDropDown from '@/components/sidebar/notifications-dropdown';
import Sidebar from '@/components/sidebar/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useGetUserNotifications from '@/hooks/api/userNotifications/useGetUserNotifications';
import useAdminMode from '@/hooks/useAdminMode';
import { useAuth } from '@/hooks/useAuth';

import { createFileRoute, Outlet, redirect, Navigate } from '@tanstack/react-router';
import { BellIcon } from 'lucide-react';

export const Route = createFileRoute('/_rootLayout')({
  // beforeLoad: async ({ context }) => {
  //   const { isAuthenticated, loading } = context.state;
  //   if (!isAuthenticated && !loading) {
  //     throw redirect({ to: '/sign-in' });
  //   }
  // },
  component: () => <RootLayout />,
});

export function RootLayout() {
  const { loading, isAuthenticated } = useAuth().state;
  const { adminMode } = useAdminMode();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/sign-in' />;
  }

  return (
    <main className='flex gap-2 h-full'>
      <Sidebar />

      <div className='lg:ml-[300px] p-4 flex-1 flex flex-col'>
        {!adminMode && (
          //
          <Header />
        )}
        <Outlet />
      </div>
      <div className='absolute lg:hidden top-2 left-2'>
        <MobileNavSheet />
      </div>
    </main>
  );
}

function Header() {
  const { data: notifications } = useGetUserNotifications();
  const unreadLength = notifications?.filter((n) => !n.isRead).length || 0;
  const showNotifcationAmount = notifications && unreadLength > 0;

  return (
    <header className='flex p-2 items-center justify-end'>
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
        <AddKudosDialog />
      </div>
    </header>
  );
}
