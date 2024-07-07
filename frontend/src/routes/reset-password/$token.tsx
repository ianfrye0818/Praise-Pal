import { createFileRoute, Link } from '@tanstack/react-router';
import * as z from 'zod';
import { ErrorOption, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { FormInputItem } from '@/components/forms/form-input-item';
import { Button } from '@/components/ui/button';
import useResetPassword from '@/hooks/api/useResetPassword';
import logo from '@/assets/logo.png';

const ResetPasswordFormSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  token: z.string(),
});

export const Route = createFileRoute('/reset-password/$token')({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useParams();

  return (
    <div>
      <header className='h-24 p-1 container mx-auto'>
        <div className='container mx-auto '>
          <img
            src={logo}
            alt='logo'
            width={180}
          />
        </div>
      </header>
      <div className='w-full h-[calc(100vh-96px)] flex flex-col justify-center items-center'>
        <h1 className='text-2xl font-bold mb-6  '>
          Fill out the form below to reset your password
        </h1>
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
    </div>
  );
}

function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    defaultValues: RESET_PASSWORD_DEFAULT_VALUES(token),
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  const onSubmit = useSubmitResetPasswordForm({ setError: form.setError });

  const submitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full max-w-[500px] flex flex-col gap-4'
      >
        <FormInputItem<typeof ResetPasswordFormSchema>
          control={form.control}
          name='password'
          label='New Password'
          type='password'
          placeholder='New Password'
          disabled={submitting}
        />

        <FormInputItem<typeof ResetPasswordFormSchema>
          control={form.control}
          name='confirmPassword'
          label='Confirm Password'
          type='password'
          placeholder='Confirm Password'
          disabled={submitting}
        />
        <Button
          disabled={submitting}
          type='submit'
        >
          {submitting ? 'Submitting... ' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  );
}

const RESET_PASSWORD_DEFAULT_VALUES = (token: string) => {
  return { token, password: '', confirmPassword: '' };
};

interface ResetPasswordFormProps {
  setError: (
    name: 'password' | 'confirmPassword' | 'token' | 'root' | `root.${string}`,
    error: ErrorOption,
    options?: {
      shouldFocus: boolean;
    }
  ) => void;
}
function useSubmitResetPasswordForm({ setError }: ResetPasswordFormProps) {
  const { mutateAsync: resetPassword } = useResetPassword({ type: 'verifyToken' });

  const onSubmit = async (data: z.infer<typeof ResetPasswordFormSchema>) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    await resetPassword({ token: data.token, password: data.password });
  };

  return onSubmit;
}
