import LogoutButton from './logout-button';
import { useAuth } from '@/hooks/useAuth';
import FormDialog from '../dialogs/form-dialog';
import AddUpdateUserForm from '../forms/add-update-user-form';
import { Button } from '../ui/button';

export default function SideBarFooter() {
  const { user } = useAuth().state;
  if (!user) return <div>Footer</div>;

  return (
    <footer className='w-full p-1'>
      <div className='mt-auto flex items-center gap-2 relative'>
        <FormDialog
          description='Edit user information'
          title='Edit User'
          form={AddUpdateUserForm}
          formProps={{ type: 'update', updatingUser: user }}
        >
          <Button variant={'outline'}>Edit</Button>
        </FormDialog>
        <div className='flex-1'>
          <p className='font-medium'>{user.firstName}</p>
          <p className='text-xs 2xl:text-sm text-gray-500 dark:text-gray-400'>{user?.email}</p>
        </div>

        <LogoutButton />
      </div>
    </footer>
  );
}
