import Header from '@/components/pages-and-sections/layout-header';
import MobileNavSheet from '@/components/pages-and-sections/mobile-nav-sheet';
import Sidebar from '@/components/pages-and-sections/sidebar';
import useAdminMode from '@/hooks/useAdminMode';

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_rootLayout')({
  beforeLoad: async ({ context, location }) => {
    const { isAuthenticated, loading } = context.state;
    if (!isAuthenticated && !loading) {
      throw redirect({ to: '/sign-in', search: { redirectUrl: location.pathname } });
    }
  },
  component: () => <RootLayout />,
});

export function RootLayout() {
  const { adminMode } = useAdminMode();

  return (
    <main className='flex h-full '>
      <Sidebar />

      <div className='lg:ml-[300px] md:p-4 flex-1 flex flex-col'>
        {!adminMode && <Header />}
        <Outlet />
      </div>
      <div className='lg:hidden'>
        <MobileNavSheet />
      </div>
    </main>
  );
}
