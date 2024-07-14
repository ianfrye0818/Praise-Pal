import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormInputItem } from './form-input-item';
import { SIGN_UP_FORM_DEFAULT_VALUES } from '@/constants';
import useSubmitSignUpForm from '@/hooks/forms/useSubmitSignUpForm';
import SendPassWordResetLinkDialog from '../dialogs/send-password-reset-link-dialog';
import { addUserSchema } from '@/zodSchemas';
import { SignUpFormProps } from '@/types';

export default function SignUpForm() {
  const form = useForm<SignUpFormProps>({
    resolver: zodResolver(addUserSchema),
    defaultValues: SIGN_UP_FORM_DEFAULT_VALUES,
  });

  const isSubmitting = form.formState.isSubmitting;
  const globalError = form.formState.errors.root;

  const onSubmit = useSubmitSignUpForm(form);

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Register</CardTitle>
        <CardDescription>Fill out the form to create your account.</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            <FormInputItem<typeof addUserSchema>
              control={form.control}
              name='email'
              label='Email'
              placeholder='Enter your email'
              type='email'
            />
            <div className='grid grid-cols-2 gap-4'>
              <FormInputItem<typeof addUserSchema>
                control={form.control}
                name='password'
                label='Password'
                placeholder='Enter your password'
                type='password'
              />
              <FormInputItem<typeof addUserSchema>
                control={form.control}
                name='confirmPassword'
                label='Confirm Password'
                placeholder='Confirm your password'
                type='password'
              />
            </div>
            <FormInputItem<typeof addUserSchema>
              control={form.control}
              name='companyCode'
              label='Company Code'
              placeholder='Enter your company code'
              type='text'
              maxLength={4}
              minLength={4}
            />
            <div className='flex justify-between'>
              <FormInputItem<typeof addUserSchema>
                control={form.control}
                name='firstName'
                label='First Name'
                placeholder='Enter your first name'
                type='text'
              />

              <FormInputItem<typeof addUserSchema>
                control={form.control}
                name='lastName'
                label='Last Name'
                placeholder='Enter your last name'
                type='text'
              />
            </div>
            {globalError && <p className='italic text-lg text-red-500'>{globalError?.message}</p>}
            <Button
              disabled={isSubmitting}
              className='w-full'
            >
              {isSubmitting ? 'Submitting....' : 'Sign Up'}
            </Button>
          </form>
        </Form>
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
          <SendPassWordResetLinkDialog>
            <span className='text-blue-600'>Forgot Password?</span>
          </SendPassWordResetLinkDialog>
        </p>
      </CardFooter>
    </Card>
  );
}
