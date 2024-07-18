import logo from '@/assets/logo.png';
import { createFileRoute, Outlet, redirect, Link } from '@tanstack/react-router';
import * as z from 'zod';

const searchSchema = z.object({
  redirectUrl: z.string().optional(),
});

export const Route = createFileRoute('/_authLayout')({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated, loading } = context.state;
    if (isAuthenticated && !loading) {
      const lastPath = sessionStorage.getItem('lastPath') || null;
      throw redirect({ to: lastPath ?? '/' });
    }
  },
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  component: AuthLayout,
});

function AuthLayout() {
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
