import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authLayout')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <AuthLayout />,
});

function AuthLayout() {
  return (
    <main className='h-full w-full'>
      <Outlet />
    </main>
  );
}
