import AddUserDialog from '@/components/dialogs-and-menus/add-user-dialog';
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
        <h2 className='font-semibold text-2xl md:text-2xl my-4'>Users</h2>
        <div className='flex gap-3 items-center'>
          <p className='text-sm italic hidden md:block'>
            Users accounts can be restored for up to 30 days after they are deleted
          </p>
          <AddUserDialog />
        </div>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
