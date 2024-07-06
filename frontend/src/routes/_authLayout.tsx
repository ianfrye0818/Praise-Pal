import { IMAGES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router';

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
            src={IMAGES.logo}
            alt='logo'
            width={180}
          />
        </div>
      </header>
      <Outlet />
    </main>
  );
}
