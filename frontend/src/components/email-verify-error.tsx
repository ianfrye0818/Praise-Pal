import { Link } from '@tanstack/react-router';

export default function EmailVerifyError() {
  return (
    <div className='flex flex-col gap-3 items-center'>
      <h1 className='text-2xl font-bold'>There was an error verifying your email</h1>
      <p className='text-xl'>
        Please contact your company owner or account manager for further details
      </p>
      <Link
        className='text-blue-400'
        to='/sign-in'
      >
        Back to Sign In
      </Link>
    </div>
  );
}
