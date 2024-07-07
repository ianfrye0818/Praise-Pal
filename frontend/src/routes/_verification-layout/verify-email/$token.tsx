import EmailVerifyError from '@/components/email-verify-error';
import EmailVerifySuccess from '@/components/email-verify-success';
import useVerifyEmail from '@/hooks/api/useVerifyEmail';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_verification-layout/verify-email/$token')({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = Route.useParams();
  const {
    mutateAsync: verifyEmailToken,
    isSuccess,
    isError,
  } = useVerifyEmail({ type: 'verifyToken' });

  useEffect(() => {
    verifyEmailToken({ token });
  }, []);

  return isSuccess ? <EmailVerifySuccess /> : isError ? <EmailVerifyError /> : null;
}
