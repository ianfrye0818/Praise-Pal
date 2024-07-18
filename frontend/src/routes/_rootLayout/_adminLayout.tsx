import Header from '@/components/pages-and-sections/layout-header';
import { useAuth } from '@/hooks/useAuth';
import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_rootLayout/_adminLayout')({
  component: AdminLayout,
});
function AdminLayout() {
  const { isAdmin, loading } = useAuth().state;

  if (!loading && !isAdmin) {
    return <Navigate to='/' />;
  }

  return (
    <main className='w-screen md:w-auto'>
      <Header showAddKudos={false} />
      <Outlet />
    </main>
  );
}
