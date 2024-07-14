import { Button } from '@/components/ui/button';

import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import FormDialog from '../dialogs-and-menus/form-dialog';
import PasswordResetForm from '../dialogs-and-menus/send-password-reset-link-dialog';
import SignUpForm from '../forms/sign-up-form';
import ForgotPasswordButton from '../switches-and-buttons/forgot-password-button';

export default function SignUpCard() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Register</CardTitle>
        <CardDescription>Fill out the form to create your account.</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <SignUpForm />
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <p className='w-full text-left'>
          Already have an account?{' '}
          <Link
            to='/sign-in'
            className='text-blue-600'
          >
            {' '}
            Sign In
          </Link>
        </p>
        <p className='w-full text-left'>
          <ForgotPasswordButton />
        </p>
      </CardFooter>
    </Card>
  );
}
