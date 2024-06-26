import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { signInFormSchema } from '@/zodSchemas';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormInputItem } from './form-input-item';
import { Form } from '../ui/form';
import useSetLogoutError from '@/hooks/useSetLogoutError';

import { SIGN_IN_FORM_DEFAULT_VALUES } from '@/constants';
import useSubmitSignInForm from '@/hooks/forms/useSubmitSignInForm';

export default function SignInForm() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: SIGN_IN_FORM_DEFAULT_VALUES,
  });
  const isSubmitting = form.formState.isSubmitting;
  const globalError = form.formState.errors.root;

  const logOutErrorMessage = useSetLogoutError();

  const onSubmit = useSubmitSignInForm(form);

  return (
    <Card className='w-full max-w-md'>
      {logOutErrorMessage && (
        <p className='text-red-600 text-center my-5 text-lg'>{logOutErrorMessage}</p>
      )}
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>Fill out the form to login to your account.</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            <FormInputItem<typeof signInFormSchema>
              control={form.control}
              name='email'
              placeholder='m@example.com'
              label='Email'
              type='email'
            />

            <FormInputItem<typeof signInFormSchema>
              control={form.control}
              name='password'
              label='Password'
              placeholder='Password'
              type='password'
            />

            {globalError && <p className='italic text-lg text-red-500'>{globalError.message}</p>}
            <Button
              disabled={isSubmitting}
              className='w-full'
            >
              {isSubmitting ? 'Submitting... ' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>
          {"Don't have an account? "}
          <Link
            to='/sign-up'
            className='text-blue-600'
          >
            {' '}
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
