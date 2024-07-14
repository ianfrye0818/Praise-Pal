import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_verification-layout/verify-email/$token')({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return <div>Email Token Page</div>;
}
