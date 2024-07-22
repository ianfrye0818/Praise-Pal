import { Link } from '@tanstack/react-router';

export default function SignUpCompanyLink() {
  return (
    <p className='justify-self-start w-full text-sm text-blue-600 hover:underline'>
      <Link to='/company-sign-up'>Looking to register your company?</Link>
    </p>
  );
}
