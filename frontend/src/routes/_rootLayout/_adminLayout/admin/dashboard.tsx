import CompanyCard from '@/components/cards/company-card';
import ErrorComponent from '@/components/pages-and-sections/error-component';
import KudosDashboardSection from '@/components/pages-and-sections/kudos-dashboard-section';
import UsersDashboardSection from '@/components/pages-and-sections/users-dashboard-section';
import DataLoader from '@/components/ui/data-loader';
import useGetAdminDashBoardData from '@/hooks/api/useGetAdminDashBoardData';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_rootLayout/_adminLayout/admin/dashboard')({
  component: () => <AdminDashboard />,
});

export function AdminDashboard() {
  const { users, kudos, company, isLoading, isError } = useGetAdminDashBoardData();
  if (isLoading) {
    return <DataLoader />;
  }

  if (isError) {
    return <ErrorComponent />;
  }

  return (
    <main className='flex flex-1 flex-col p-2 md:gap-8 md:p-6 items-center '>
      {company && <CompanyCard company={company} />}
      {users && <UsersDashboardSection users={users} />}
      {kudos && <KudosDashboardSection kudos={kudos} />}
    </main>
  );
}
