import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Role, User } from '@/types';
import { updateUserSchema } from '@/zodSchemas';
import { useAuth } from '@/hooks/useAuth';
import { DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInputItem } from '@/components/forms/form-input-item';
import FormSelectItem from '@/components/forms/form-select-item';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import useSuccessToast from '@/hooks/useSuccessToast';
import useErrorToast from '@/hooks/useErrorToast';
import useUpdateCurrentUser from '@/hooks/api/useCompayUsers/useUpdateCurrentUser';
import useUpdateCompanyUser from '@/hooks/api/useCompayUsers/useUpdateCompanyUser';
import { getRoleOptions } from '@/lib/utils';
import FormDialog from '../dialogs-and-menus/form-dialog';
import DeleteConfirmationForm from './delete-confirmation-form';

const defaultUpdateValues = (updatingUser?: User) => ({
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

  const form = useForm<z.infer<typeof updateUserSchema>>({
    defaultValues: defaultUpdateValues(updatingUser),
    resolver: zodResolver(updateUserSchema),
  });
  const { successToast } = useSuccessToast();
  const { errorToast } = useErrorToast();

  const { mutateAsync: updateUser } = useUpdateCompanyUser();
  const { mutateAsync: updateCurrentUser } = useUpdateCurrentUser();

  const updatingCurrentUser = currentUser?.userId === updatingUser?.userId;

  const onSubmit = async (data: z.infer<typeof updateUserSchema>) => {
    try {
      if (updatingCurrentUser) {
        await updateCurrentUser({
          companyCode: updatingUser?.companyCode as string,
          currentUser: currentUser as User,
          payload: data as z.infer<typeof updateUserSchema>,
        });
        successToast({ title: 'Success', message: 'User updated successfully' });
      } else {
        await updateUser({
          companyCode: updatingUser?.companyCode as string,
          currentUser: currentUser as User,
          userToUpdateId: updatingUser?.userId as string,
          payload: data as z.infer<typeof updateUserSchema>,
        });
        successToast({ title: 'Success', message: 'User updated successfully' });
      }
    } catch (error) {
      console.error(['onSubmit'], error);
      errorToast({ message: 'Error updating user' });
    }
  };

  const disableUpdateRole =
    currentUser?.role !== Role.COMPANY_OWNER || updatingUser?.userId === currentUser?.userId;
  const disableCompanyCode = currentUser?.role !== Role.SUPER_ADMIN;

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      setOpen(false);
    }
  }, [form.formState.isSubmitSuccessful, setOpen]);

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
        <FormSelectItem
          control={form.control}
          name='role'
          options={getRoleOptions()}
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
          <div className='mr-auto'>
            <FormDialog
              title={'Are you sure you want to delete?'}
              description='Are you sure you want to delete this account?'
              form={DeleteConfirmationForm}
              formProps={{
                email: updatingUser!.email,
                userId: updatingUser!.userId,
                companyCode: currentUser?.companyCode,
              }}
            >
              <Button
                type='button'
                variant={'destructive'}
              >
                Delete Account
              </Button>
            </FormDialog>
          </div>
          {/* <div className='mr-auto'>
            <DeleteConfirmDialog
              action={async () => {
                await deleteUser({
                  companyCode: updatingUser?.companyCode as string,
                  userId: updatingUser?.userId as string,
                });
                setOpen(false);
              }}
              currentUser={currentUser as User}
              setOpen={setOpen}
              submitting={form.formState.isSubmitting}
              user={updatingUser as User}
            />
          </div> */}
          <div>
            <Button
              onClick={() => setOpen(false)}
              type='button'
              variant={'outline'}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Update User
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
