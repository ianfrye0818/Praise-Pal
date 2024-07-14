import FormDialog from '@/components/dialogs/form-dialog';
import AddUpdateUserForm from '@/components/forms/add-update-user-form';
import ToggleActiveSwitch from '@/components/switches-and-buttons/toggle-user-active-switch';
import UserTableActionButtons from '@/components/switches-and-buttons/user-table-action-buttons';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import UserAvitar from '@/components/UserAvitar';
import { capitalizeString, getUserDisplayName } from '@/lib/utils';
import { User } from '@/types';
import { IoArrowBackSharp } from 'react-icons/io5';
import { Link } from '@tanstack/react-router';

interface UsersTableProps {
  skip?: number;
  search?: string;
  users: User[];
  showUserAmount?: boolean;
}

export default function UsersTable({ users, showUserAmount = true, skip }: UsersTableProps) {
  return (
    <div className=''>
      {showUserAmount && (
        <div className='flex items-center justify-between py-3 pr-4'>
          <div className='flex flex-col gap-3'>
            <Link
              to='/admin/dashboard'
              className='flex items-center font-semibold gap-1 max-w-max'
            >
              <IoArrowBackSharp size={25} /> Go back
            </Link>
            <p className=' p-2 text-lg font-bold'>Total Users: {users.length}</p>
          </div>
          <FormDialog
            description='Add a new user'
            title='Add User'
            form={AddUpdateUserForm}
            formProps={{ type: 'add' }}
          >
            <Button variant={'confirm'}>Add User</Button>
          </FormDialog>
        </div>
      )}
      <div className='border shadow-sm rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Acivated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <UserAvitar displayName={getUserDisplayName(user)} />
                    <span className='flex gap-2 items-center'>
                      {user.firstName ?? ''} {user.lastName ?? ''}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{capitalizeString(user.role)}</TableCell>
                <TableCell>
                  <ToggleActiveSwitch
                    user={user}
                    limit={skip}
                  />
                </TableCell>
                <TableCell>
                  <>
                    <FormDialog
                      description='Edit user information'
                      title='Edit User'
                      form={AddUpdateUserForm}
                      formProps={{ type: 'update', updatingUser: user }}
                    >
                      <Button variant={'outline'}>Edit</Button>
                    </FormDialog>

                    <UserTableActionButtons updatingUser={user as User} />
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
