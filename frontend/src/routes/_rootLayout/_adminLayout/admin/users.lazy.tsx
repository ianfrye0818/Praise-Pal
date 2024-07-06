import UsersTable from '@/components/admin/tables/user-table';
import useGetCompanyUsers from '@/hooks/api/useCompayUsers/useGetCompanyUsers';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_rootLayout/_adminLayout/admin/users')({
  component: () => <UsersAdminPage />,
});

function UsersAdminPage() {
  const { user } = useAuth().state;
  const {
    data: users,
    isLoading,
    isError,
  } = useGetCompanyUsers({
    companyId: user?.companyId as string,
    roles: [Role.USER, Role.ADMIN, Role.COMPANY_OWNER],
  });

  //TODO: add loading and error components
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  //TODO: add no users found component
  if (!users || !users.length) return <div>No Users</div>;

  return (
    <div className='w-full py-5 p-1 md:p-4 h-full'>
      <div className='flex items-center'>
        <h2 className='font-semibold text-lg md:text-2xl my-4'>Users</h2>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
