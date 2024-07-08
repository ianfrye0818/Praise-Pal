import { getUserDisplayName } from '@/lib/utils';
import UpdateUserDialog from '../dialogs/update-user-dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import UserAvitar from '../UserAvitar';
import LogoutButton from './logout-button';
import { useAuth } from '@/hooks/useAuth';

export default function SideBarFooter() {
  const { state } = useAuth();
  const user = state.user;
  if (!user) return <div>Footer</div>;
  const displayName = getUserDisplayName(user);

  return (
    <footer className='w-full p-1'>
      <div className='mt-auto flex items-center gap-2 relative'>
        <UpdateUserDialog
          updatingUser={user}
          currentUser={user}
        >
          <UserAvitar displayName={displayName} />
        </UpdateUserDialog>
        <div className='flex-1'>
          <p className='font-medium'>{user.firstName || user.displayName}</p>
          <p className='text-xs 2xl:text-sm text-gray-500 dark:text-gray-400'>{user?.email}</p>
        </div>

        <LogoutButton />
      </div>
    </footer>
  );
}
