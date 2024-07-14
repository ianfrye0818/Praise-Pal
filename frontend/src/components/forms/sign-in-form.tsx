import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { signInFormSchema } from '@/zodSchemas';
import { FormInputItem } from './form-input-item';
import { Form } from '../ui/form';
import { SIGN_IN_FORM_DEFAULT_VALUES } from '@/constants';
import useSubmitSignInForm from '@/hooks/forms/useSubmitSignInForm';

export default function SignInForm() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: SIGN_IN_FORM_DEFAULT_VALUES,
  });
  const isSubmitting = form.formState.isSubmitting;
  const globalError = form.formState.errors.root;

  const onSubmit = useSubmitSignInForm();
  return (
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
  );
}
