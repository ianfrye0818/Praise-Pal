import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import UsersTable from './tables/user-table';
import { User } from '@/types';

export default function UsersDashboardCard({ users }: { users: User[] }) {
  return (
    <div className='w-full'>
      <div className='flex items-center'>
        <h2 className='font-semibold text-lg md:text-2xl my-4'>Users</h2>
        <Button
          className='ml-auto'
          size={'sm'}
          asChild
        >
          <Link to={'/admin/users'}>View All</Link>
        </Button>
      </div>
      <UsersTable
        users={users}
        showUserNumber={false}
        limit={10}
      />
    </div>
  );
}
