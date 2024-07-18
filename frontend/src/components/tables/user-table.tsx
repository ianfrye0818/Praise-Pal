import FormDialog from '@/components/dialogs-and-menus/form-dialog';
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
import { capitalizeString, getUserDisplayName } from '@/lib/utils';
import { Role, User } from '@/types';
import { IoArrowBackSharp } from 'react-icons/io5';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import UserAvitar from '../ui/user-avatar';
import UpdateUserForm from '../forms/update-user-form';

interface UsersTableProps {
  skip?: number;
  take?: number;
  search?: string;
  users: User[];
  showUserAmount?: boolean;
}

export default function UsersTable({ users, showUserAmount = false, take }: UsersTableProps) {
  const { user: currentUser } = useAuth().state;
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
            form={UpdateUserForm}
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
            {users.map((user) => {
              const disabled =
                (user.role !== Role.USER &&
                  currentUser?.role !== Role.COMPANY_OWNER &&
                  currentUser?.role !== Role.SUPER_ADMIN) ||
                currentUser?.userId === user.userId;
              return (
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
                      take={take}
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <FormDialog
                        title='Update User'
                        description='Update user information'
                        form={UpdateUserForm}
                        formProps={{ type: 'update', updatingUser: user }}
                      >
                        <Button
                          variant={'outline'}
                          disabled={disabled || user.deletedAt !== null}
                        >
                          Edit
                        </Button>
                      </FormDialog>

                      <UserTableActionButtons
                        updatingUser={user as User}
                        disabled={disabled}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
