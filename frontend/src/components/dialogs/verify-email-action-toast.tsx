import useVerifyEmail from '@/hooks/api/useVerifyEmail';
import { Button } from '../ui/button';

export default function VerifyEmailAction({ email }: { email: string }) {
  const {
    mutateAsync: sendVerificationEmail,
    isSuccess,
    isPending,
  } = useVerifyEmail({ type: 'sendVerifyEmail' });
  return (
    <Button
      variant={'outline'}
      className='w-full text-midnightGreen bg-zinc-100'
      onClick={() => sendVerificationEmail({ email })}
      disabled={isPending || isSuccess}
    >
      Send verification email?
    </Button>
  );
}
