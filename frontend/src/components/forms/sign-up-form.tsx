import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { SIGN_UP_FORM_DEFAULT_VALUES } from '@/constants';
import useSubmitSignUpForm from '@/hooks/forms/useSubmitSignUpForm';
import { addUserSchema } from '@/zodSchemas';
import { SignUpFormProps } from '@/types';
import { FormInputItem } from './form-input-item';

export default function SignUpForm() {
  const form = useForm<SignUpFormProps>({
    resolver: zodResolver(addUserSchema),
    defaultValues: SIGN_UP_FORM_DEFAULT_VALUES,
  });

  const isSubmitting = form.formState.isSubmitting;
  const globalError = form.formState.errors.root;

  const onSubmit = useSubmitSignUpForm(form);

  return (
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
  );
}
