import SignInCard from '@/components/cards/sign-in-card';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authLayout/sign-in')({
  component: () => <SignInPage />,
});

function SignInPage() {
  return (
    <div className='h-[calc(100dvh-96px)] w-full flex flex-col justify-center items-center'>
      <SignInCard />
    </div>
  );
}
