import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authLayout')({
  component: () => <AuthLayout />,
});

function AuthLayout() {
  const { isAuthenticated } = useAuth().state;
  const lastPath = sessionStorage.getItem('lastPath') || null;

  if (isAuthenticated) {
    if (lastPath) {
      return <Navigate to={lastPath} />;
    }
    return <Navigate to='/' />;
  }

  return (
    <main className='h-full w-full'>
      <header className='h-[96px]  p-1'>
        <div className='container mx-auto '>
          <img
            src={logo}
            alt='logo'
            width={180}
          />
        </div>
      </header>
      <Outlet />
    </main>
  );
}
