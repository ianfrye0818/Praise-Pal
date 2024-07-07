import { createFileRoute, Outlet } from '@tanstack/react-router';
import logo from '@/assets/logo.png';

export const Route = createFileRoute('/_verification-layout')({
  component: VerificationLayout,
});

function VerificationLayout() {
  return (
    <div>
      <VerificationHeader />
      <div className='w-full h-[calc(100vh-96px)] flex flex-col justify-center items-center'>
        <Outlet />
      </div>
    </div>
  );
}

function VerificationHeader() {
  return (
    <header className='h-24 p-1 container mx-auto'>
      <div className='container mx-auto '>
        <img
          src={logo}
          alt='logo'
          width={180}
        />
      </div>
    </header>
  );
}
