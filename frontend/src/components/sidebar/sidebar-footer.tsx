import UpdateUserDialog from '../dialogs/update-user-dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import LogoutButton from './logout-button';
import { useAuth } from '@/hooks/useAuth';

export default function SideBarFooter() {
  const { state } = useAuth();
  const user = state.user;
  if (!user) return <div>Footer</div>;

  return (
    <footer>
      <div className='mt-auto flex items-center gap-2 relative'>
        <UpdateUserDialog
          updatingUser={user}
          trigger={<UserDialogTrigger name={user.firstName || user.displayName} />}
          currentUser={user}
        />
        <div className='flex-1'>
          <p className='font-medium'>{user.firstName || user.displayName}</p>
          <p className='text-xs 2xl:text-sm text-gray-500 dark:text-gray-400'>{user?.email}</p>
        </div>

        <LogoutButton />
      </div>
    </footer>
  );
}

function UserDialogTrigger({ name }: { name: string }) {
  return (
    <Avatar>
      <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
