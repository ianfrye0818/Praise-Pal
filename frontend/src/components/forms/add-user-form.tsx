import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Role, User } from '@/types';
import { addUserSchema } from '@/zodSchemas';
import { useAuth } from '@/hooks/useAuth';
import { DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInputItem } from '@/components/forms/form-input-item';
import FormSelectItem from '@/components/forms/form-select-item';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import useSuccessToast from '@/hooks/useSuccessToast';
import useCreateCompanyUser from '@/hooks/api/useCompayUsers/useCreateCompanyUser';
import { getRoleOptions } from '@/lib/utils';
import { isCustomError, isError } from '@/errors';

const defaultAddValues = (currentUser: User) => ({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  role: Role.USER,
  companyCode: currentUser.companyCode,
});

interface AddUserFormProps {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddUserForm({ setOpen }: AddUserFormProps) {
  const { user: currentUser } = useAuth().state;
  const form = useForm<z.infer<typeof addUserSchema>>({
    defaultValues: defaultAddValues(currentUser!),
    resolver: zodResolver(addUserSchema),
  });
  const { successToast } = useSuccessToast();

  const { mutateAsync: createUser, isSuccess } = useCreateCompanyUser();

  const onSubmit = async (data: z.infer<typeof addUserSchema>) => {
    try {
      if (data.password !== data.confirmPassword) {
        form?.setError('confirmPassword', { message: 'Passwords do not match' });
        return;
      }
      await createUser(data as z.infer<typeof addUserSchema>);
      successToast({ title: 'Success', message: 'User created successfully' });
    } catch (error) {
      console.error(['addUserForm'], error);
      form.setError('root', {
        message: isCustomError(error) || isError(error) ? error.message : 'An error occurred',
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const isGlobalError = form.formState.errors.root;
  const isFormValid = form.formState.isValid;

  useEffect(() => {
    if (isSuccess) {
      setOpen && setOpen(false);
    }
  }, [isSuccess, setOpen]);

  return (
    <Form {...form}>
      <form className='flex flex-col gap-3'>
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
        <FormSelectItem
          control={form.control}
          name='role'
          options={getRoleOptions()}
          label='Role'
        />
        <FormInputItem
          control={form.control}
          name='companyCode'
          label='Company Code'
          placeholder='Company Code'
          disabled={currentUser?.role !== Role.SUPER_ADMIN}
        />
        {isGlobalError && <p className='text-red-600 italic text-sm'>{isGlobalError.message}</p>}
        <DialogFooter className='mt-3 gap-3'>
          <Button
            onClick={() => setOpen && setOpen(false)}
            type='button'
            variant={'outline'}
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={form.handleSubmit(onSubmit)}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add User'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
