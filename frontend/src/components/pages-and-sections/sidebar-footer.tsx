import LogoutButton from '../switches-and-buttons/logout-button';
import { useAuth } from '@/hooks/useAuth';
import FormDialog from '../dialogs-and-menus/form-dialog';
import { Button } from '../ui/button';
import UserAvitar from '../ui/user-avatar';
import { getUserDisplayName } from '@/lib/utils';
import UpdateUserForm from '../forms/update-user-form';

export default function SideBarFooter() {
  const { user: currentUser } = useAuth().state;
  if (!currentUser) return <div>Footer</div>;

  return (
    <footer className='w-full p-1'>
      <div className='mt-auto flex items-center gap-2'>
        <FormDialog
          description='Update user information'
          title='Update User'
          form={UpdateUserForm}
          formProps={{ type: 'update', updatingUser: currentUser }}
        >
          <Button
            size={'sm'}
            variant={'ghost'}
          >
            <UserAvitar displayName={getUserDisplayName(currentUser)} />
          </Button>
        </FormDialog>
        <div className='flex-1'>
          <p className='font-medium'>{currentUser.firstName}</p>
          <p className='text-xs 2xl:text-sm text-gray-500 dark:text-gray-400'>
            {currentUser?.email}
          </p>
        </div>
        <LogoutButton />
      </div>
    </footer>
  );
}
