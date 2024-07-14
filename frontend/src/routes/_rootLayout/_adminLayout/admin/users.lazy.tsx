import UsersTable from '@/components/tables/user-table';
import DataLoader from '@/components/ui/data-loader';
import useGetCompanyUsers from '@/hooks/api/useCompayUsers/useGetCompanyUsers';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_rootLayout/_adminLayout/admin/users')({
  component: () => <UsersAdminPage />,
});

function UsersAdminPage() {
  const { user } = useAuth().state;
  const { data: users, isLoading } = useGetCompanyUsers({
    companyCode: user?.companyCode as string,
    roles: [Role.USER, Role.ADMIN, Role.COMPANY_OWNER],
  });

  if (isLoading) {
    return <DataLoader />;
  }

  if (!users || !users.length) return <div>No Users</div>;

  return (
    <div className='w-full py-5 p-1 md:p-4 h-full'>
      <div className='flex items-baseline justify-between'>
        <h2 className='font-semibold text-lg md:text-2xl my-4'>Users</h2>
        <p className='text-sm italic'>
          Deleted users can be restored for up to 30 days since they were deleted
        </p>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
