import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import logo from '@/assets/logo.png';

export const Route = createFileRoute('/_verification-layout')({
  component: VerificationLayout,
});

function VerificationLayout() {
  return (
    <main className='p-2'>
      <VerificationHeader />
      <div className='w-full h-[calc(100vh-96px)] flex flex-col justify-center items-center'>
        <Outlet />
      </div>
    </main>
  );
}

function VerificationHeader() {
  return (
    <header className='h-24 p-1 container mx-auto'>
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
  );
}
