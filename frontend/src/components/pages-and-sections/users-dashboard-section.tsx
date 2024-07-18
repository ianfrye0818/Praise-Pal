import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import UsersTable from '../tables/user-table';
import { User } from '@/types';
import AddUserDialog from '../dialogs-and-menus/add-user-dialog';

export default function UsersDashboardSection({ users }: { users: User[] }) {
  return (
    <section className='w-full'>
      <div className='flex items-center'>
        <h2 className='font-semibold text-lg md:text-2xl my-4'>Users</h2>

        <div className='ml-auto flex gap-2'>
          <AddUserDialog />
          <Button asChild>
            <Link to={'/admin/users'}>View All</Link>
          </Button>
        </div>
      </div>
      <UsersTable
        users={users}
        showUserAmount={false}
        take={10}
      />
    </section>
  );
}
