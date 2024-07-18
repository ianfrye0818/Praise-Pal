import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RESET_PASSWORD_DEFAULT_VALUES } from '@/constants';
import useSubmitResetPasswordForm from '@/hooks/forms/useSubmitResetPasswordForm';
import { ResetPasswordFormSchema } from '@/zodSchemas';
import { Form } from '../ui/form';
import { FormInputItem } from './form-input-item';
import { Button } from '../ui/button';

export default function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    defaultValues: RESET_PASSWORD_DEFAULT_VALUES(token),
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  const onSubmit = useSubmitResetPasswordForm({ setError: form.setError });

  const submitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;
  const globalError = form.formState.errors.root?.message;

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
        {globalError && <p className='text-red-500 italic text-sm'>{globalError}</p>}
        <Button
          disabled={!isValid || submitting}
          type='submit'
        >
          {submitting ? 'Submitting... ' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  );
}
