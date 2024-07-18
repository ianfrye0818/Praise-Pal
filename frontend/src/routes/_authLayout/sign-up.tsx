import SignUpCard from '@/components/cards/sign-up-card';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authLayout/sign-up')({
  component: () => <SignUpPage />,
});

function SignUpPage() {
  return (
    <div className='h-[calc(100dvh-96px)] w-full flex flex-col justify-center items-center'>
      <SignUpCard />
    </div>
  );
}
