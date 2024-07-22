import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Role, UpdateUserProps, User } from '@/types';
import { UpdateUserSchema } from '@/zodSchemas';
import { useAuth } from '@/hooks/useAuth';
import { DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInputItem } from '@/components/forms/form-input-item';
import FormSelectItem from '@/components/forms/form-select-item';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import useSuccessToast from '@/hooks/useSuccessToast';
import useErrorToast from '@/hooks/useErrorToast';
import useUpdateCurrentUser from '@/hooks/api/useCompayUsers/useUpdateCurrentUser';
import useUpdateCompanyUser from '@/hooks/api/useCompayUsers/useUpdateCompanyUser';
import { getRoleOptions } from '@/lib/utils';
import FormDialog from '../dialogs-and-menus/form-dialog';
import DeleteConfirmationForm from './delete-confirmation-form';

const defaultUpdateValues = (updatingUser: User) => ({
  email: updatingUser?.email || '',
  firstName: updatingUser?.firstName || '',
  lastName: updatingUser?.lastName || '',
  role: updatingUser?.role || Role.USER,
  companyCode: updatingUser?.companyCode || '',
});

interface UpdateUserFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updatingUser: User;
}

export default function UpdateUserForm({ setOpen, updatingUser }: UpdateUserFormProps) {
  const { user: currentUser } = useAuth().state;
  const [canSumbit, setCanSubmit] = useState(true);

  const form = useForm<UpdateUserProps>({
    defaultValues: defaultUpdateValues(updatingUser),
    resolver: zodResolver(UpdateUserSchema),
  });
  const { successToast } = useSuccessToast();
  const { errorToast } = useErrorToast();

  const { mutateAsync: updateUser } = useUpdateCompanyUser();
  const { mutateAsync: updateCurrentUser } = useUpdateCurrentUser();

  const updatingCurrentUser = currentUser?.userId === updatingUser?.userId;

  const onSubmit = async (data: UpdateUserProps) => {
    if (!canSumbit) return;
    try {
      if (updatingCurrentUser) {
        await updateCurrentUser({
          companyCode: updatingUser?.companyCode as string,
          currentUser: currentUser as User,
          payload: data as UpdateUserProps,
        });
        successToast({ title: 'Success', message: 'User updated successfully' });
      } else {
        await updateUser({
          companyCode: updatingUser?.companyCode as string,
          currentUser: currentUser as User,
          userToUpdateId: updatingUser?.userId as string,
          payload: data as UpdateUserProps,
        });
        successToast({ title: 'Success', message: 'User updated successfully' });
      }
    } catch (error) {
      console.error(['onSubmit'], error);
      errorToast({ message: 'Error updating user' });
    }
  };

  const isCompanyOwner = currentUser?.role === Role.COMPANY_OWNER;
  const isCurrentUser = updatingUser?.userId === currentUser?.userId;
  const disableUpdateRole = !isCompanyOwner || isCurrentUser;
  const disableCompanyCode = currentUser?.role !== Role.SUPER_ADMIN;

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && canSumbit) {
      setOpen(false);
    }
  }, [form.formState.isSubmitSuccessful, setOpen, canSumbit]);

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-3'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex items-center gap-2'>
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

        <FormSelectItem
          control={form.control}
          name='role'
          options={
            isCompanyOwner && isCurrentUser
              ? [{ label: 'Company Owner', value: Role.COMPANY_OWNER }]
              : getRoleOptions()
          }
          label='Role'
          disabled={disableUpdateRole}
        />

        <FormInputItem
          control={form.control}
          name='companyCode'
          label='Company Code'
          placeholder='Company Code'
          disabled={disableCompanyCode}
        />
        <DialogFooter className='mt-3'>
          <div className='w-full flex flex-col md:flex-row justify-between gap-2'>
            <FormDialog
              title={'Are you sure you want to delete?'}
              description='Are you sure you want to delete this account?'
              form={DeleteConfirmationForm}
              formProps={{
                email: updatingUser!.email,
                userId: updatingUser!.userId,
                companyCode: currentUser?.companyCode,
                setCanSubmit,
                setMenuOpen: setOpen,
              }}
            >
              <Button
                disabled={isCompanyOwner && isCurrentUser}
                type='button'
                variant={'destructive'}
                onClick={() => setCanSubmit(false)}
              >
                Delete Account
              </Button>
            </FormDialog>
          </div>
          <div className='flex flex-col md:flex-row items-center gap-2'>
            <Button
              className='block w-full md:w-auto md:inline my-2 md:my-auto order-1 md:-order-1'
              onClick={() => setOpen(false)}
              type='button'
              variant={'outline'}
            >
              Cancel
            </Button>
            <Button
              className='block w-full md:w-auto md:inline my-2 md:my-auto'
              type='submit'
              disabled={!canSumbit || !form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? 'Updating...'
                : isCurrentUser
                  ? 'Update'
                  : 'Update User'}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
