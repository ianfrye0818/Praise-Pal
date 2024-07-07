import { createFileRoute, Link } from '@tanstack/react-router';
import ResetPasswordForm from '@/components/forms/reset-password-form';

export const Route = createFileRoute('/_verification-layout/reset-password/$token')({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useParams();

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6  '>Fill out the form below to reset your password</h1>
      <ResetPasswordForm token={token} />
      <p className='mt-6'>
        Having second thoughts?{' '}
        <Link
          className='text-blue-600 underline font-sans'
          to='/sign-in'
        >
          Click here to sign in.
        </Link>
      </p>
    </div>
  );
}
