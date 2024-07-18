import logo from '@/assets/logo.png';
import { useAuth } from '@/hooks/useAuth';
import { createFileRoute, Outlet, Navigate, Link } from '@tanstack/react-router';
import * as z from 'zod';

const searchSchema = z.object({
  redirectUrl: z.string().optional(),
});

export const Route = createFileRoute('/_authLayout')({
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  component: AuthLayout,
});

function AuthLayout() {
  const { loading, isAuthenticated } = useAuth().state;
  const lastPath = sessionStorage.getItem('lastPath') || null;

  if (!loading && isAuthenticated) {
    return <Navigate to={lastPath ?? '/'} />;
  }

  return (
    <main className='h-full w-full'>
      <header className='h-[96px]  p-1'>
        <Link to='/sign-in'>
          <div className='container mx-auto '>
            <img
              src={logo}
              alt='logo'
              width={180}
            />
          </div>
        </Link>
      </header>
      <Outlet />
    </main>
  );
}
