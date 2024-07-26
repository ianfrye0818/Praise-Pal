import Header from '@/components/pages-and-sections/layout-header';
import MobileNavSheet from '@/components/pages-and-sections/mobile-nav-sheet';
import Sidebar from '@/components/pages-and-sections/sidebar';
import useAdminMode from '@/hooks/useAdminMode';
import { useAuth } from '@/hooks/useAuth';

import { createFileRoute, Outlet, Navigate, useLocation } from '@tanstack/react-router';

export const Route = createFileRoute('/_rootLayout')({
  component: () => <RootLayout />,
});

export function RootLayout() {
  const { isAuthenticated, loading } = useAuth().state;
  const { adminMode } = useAdminMode();
  const { pathname } = useLocation();

  if (!loading && !isAuthenticated) {
    return (
      <Navigate
        to='/sign-in'
        search={{ redirectUrl: pathname }}
      />
    );
  }

  return (
    <main className='grid lg:grid-cols-rootLayout '>
      <Sidebar />
      <div className=' md:p-4 flex flex-col'>
        <Header />
        <Outlet />
      </div>
      <div className='lg:hidden'>
        <MobileNavSheet />
      </div>
    </main>
  );
}
