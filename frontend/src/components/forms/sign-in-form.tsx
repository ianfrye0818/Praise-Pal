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

import { SIGN_IN_FORM_DEFAULT_VALUES } from '@/constants';
import useSubmitSignInForm from '@/hooks/forms/useSubmitSignInForm';
import SendPassWordResetLinkDialog from '../dialogs/send-password-reset-link-dialog';

export default function SignInForm() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: SIGN_IN_FORM_DEFAULT_VALUES,
  });
  const isSubmitting = form.formState.isSubmitting;
  const globalError = form.formState.errors.root;

  const onSubmit = useSubmitSignInForm();

  return (
    <Card className='w-full max-w-md'>
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
          <SendPassWordResetLinkDialog>
            <span className='text-blue-600'>Forgot Password?</span>
          </SendPassWordResetLinkDialog>
        </p>
      </CardFooter>
    </Card>
  );
}
