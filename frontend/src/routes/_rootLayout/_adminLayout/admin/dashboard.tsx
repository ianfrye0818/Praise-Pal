import CompanyCard from '@/components/admin/company-card';
import KudosDashboardCard from '@/components/admin/kudos-dashboard-card';
import UsersDashboardCard from '@/components/admin/users-dashboard.card';
import useGetAdminDashBoardData from '@/hooks/api/useGetAdminDashBoardData';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_rootLayout/_adminLayout/admin/dashboard')({
  component: () => <AdminDashboard />,
});

export function AdminDashboard() {
  const { users, kudos, company } = useGetAdminDashBoardData();

  return (
    <main className='flex flex-1 flex-col p-2 md:gap-8 md:p-6 items-center '>
      {company && <CompanyCard company={company} />}
      {users && <UsersDashboardCard users={users} />}
      {kudos && <KudosDashboardCard kudos={kudos} />}
    </main>
  );
}
