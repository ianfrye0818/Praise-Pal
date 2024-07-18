import { Toaster } from '@/components/ui/toaster';
import { AuthState } from '@/providers/AuthReducerProvider';
import GetLastPathName from '@/providers/GetLastPathname';
import ScrollToTop from '@/providers/ScrollToTop';
import SetPathLocaiton from '@/providers/SetPathLocation';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

interface RouterContext {
  state: AuthState;
}
export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className='md:w-auto'>
      {/* <TanStackRouterDevtools /> */}
      <Outlet />
      <ScrollToTop />
      <GetLastPathName />
      <SetPathLocaiton />
      <Toaster />
    </div>
  ),
});
