import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import UsersTable from '../tables/user-table';
import { User } from '@/types';

export default function UsersDashboardSection({ users }: { users: User[] }) {
  console.log(users);
  return (
    <section className='w-full'>
      <div className='flex items-center'>
        <h2 className='font-semibold text-lg md:text-2xl my-4'>Users</h2>
        <Button
          className='ml-auto'
          asChild
        >
          <Link to={'/admin/users'}>View All</Link>
        </Button>
      </div>
      <UsersTable
        users={users}
        showUserAmount={false}
        take={10}
      />
    </section>
  );
}
