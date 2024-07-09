import UpdateUserDialog from '@/components/dialogs/update-user-dialog';
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
import { useAuth } from '@/hooks/useAuth';
import { getUserDisplayName } from '@/lib/utils';
import { User } from '@/types';

interface UsersTableProps {
  limit?: number;
  page?: number;
  search?: string;
  users: User[];

  showUserNumber?: boolean;
}

export default function UsersTable({ users, showUserNumber = true }: UsersTableProps) {
  const { user: currentUser } = useAuth().state;

  return (
    <div className=''>
      {showUserNumber && <p className=' p-2 text-lg'>Total Users: {users.length}</p>}
      <div className='border shadow-sm rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
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
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <UpdateUserDialog
                    disabled={user.role === 'COMPANY_OWNER'}
                    currentUser={currentUser as User}
                    updatingUser={user}
                  >
                    <Button
                      disabled={user.role === 'COMPANY_OWNER'}
                      size={'sm'}
                      variant={'secondary'}
                    >
                      Edit
                    </Button>
                  </UpdateUserDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
