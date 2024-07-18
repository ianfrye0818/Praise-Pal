import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignInForm from '../forms/sign-in-form';
import ForgotPasswordButton from '../switches-and-buttons/forgot-password-button';

export default function SignInCard() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>Fill out the form to login to your account.</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <SignInForm />
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <p className='w-full text-left'>
          {"Don't have an account? "}
          <Link
            to='/sign-up'
            className='text-blue-600'
          >
            {' '}
            Sign Up
          </Link>
        </p>
        <p className='w-full text-left'>
          <ForgotPasswordButton />
        </p>
      </CardFooter>
    </Card>
  );
}
