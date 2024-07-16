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
        className='flex flex-col gap-3'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex items-center gap-2 '>
          <div className='flex-1'>
            <FormInputItem
              control={form.control}
              name='firstName'
              label='First Name'
              placeholder='First Name'
            />
          </div>
          <div className='flex-1'>
            <FormInputItem
              control={form.control}
              name='lastName'
              label='Last Name'
              placeholder='Last Name'
            />
          </div>
        </div>
        <FormInputItem
          control={form.control}
          name='email'
          label='Email'
          placeholder='Email'
        />
        <FormInputItem
          control={form.control}
          name='password'
          label='Password'
          placeholder='Password'
          type='password'
        />
        <FormInputItem
          control={form.control}
          name='confirmPassword'
          label='Confirm Password'
          placeholder='Confirm Password'
          type='password'
        />
        <FormInputItem
          control={form.control}
          name='companyCode'
          label='Company Code'
          placeholder='Company Code'
          maxLength={4}
        />
        <Button
          type='submit'
          disabled={isSubmitting}
        >
          Add User
        </Button>
        {globalError && <p className='text-red-600 italic text-sm '>{globalError.message}</p>}
      </form>
    </Form>
  );
}
