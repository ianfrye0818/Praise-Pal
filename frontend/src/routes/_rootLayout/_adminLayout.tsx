import { useAuth } from '@/hooks/useAuth';
import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_rootLayout/_adminLayout')({
  component: () => <AdminLayout />,
});

function AdminLayout() {
  const { isAuthenticated, loading, isAdmin } = useAuth().state;

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to='/sign-in' />;

  if (!isAdmin) return <Navigate to='/' />;
  return (
    <div className='w-screen md:w-auto mt-12'>
      <Outlet />
    </div>
  );
}
