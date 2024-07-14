import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { cn, getRoleOptions } from '@/lib/utils';
import { Role, User } from '@/types';
import { addUserSchema, updateUserSchema } from '@/zodSchemas';
import { useAuth } from '@/hooks/useAuth';
import { DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInputItem } from '@/components/forms/form-input-item';
import FormSelectItem from '@/components/forms/form-select-item';
import DeleteConfirmDialog from '../dialogs-and-menus/delete-account-confirmation';
import useSubmitAddUpdateCompanyUserForm from '@/hooks/forms/useSubmitUpdateUserForm';
import useDeleteCompanyUser from '@/hooks/api/useCompayUsers/useDeleteCompanyUser';

const defaultAddValues = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: Role.USER,
  companyCode: '',
};

const defaultUpdateValues = (updatingUser?: User) => ({
  email: updatingUser?.email,
  companyCode: updatingUser?.companyCode,
  firstName: updatingUser?.firstName,
  lastName: updatingUser?.lastName,
  role: updatingUser?.role,
});

interface AddUpdateUserFormProps {
  type: 'add' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updatingUser?: User;
}

export default function AddUpdateUserForm({ type, setOpen, updatingUser }: AddUpdateUserFormProps) {
  const { user: currentUser } = useAuth().state;
  const formSchema = type === 'add' ? addUserSchema : updateUserSchema;

  const { mutateAsync: deleteUser } = useDeleteCompanyUser();
  const onSubmit = useSubmitAddUpdateCompanyUserForm({
    formSchema,
    type,
    updatingUser,
    currentUser: currentUser as User,
  });

  const disableUpdateRole =
    currentUser?.role !== Role.COMPANY_OWNER || updatingUser?.userId === currentUser?.userId;
  const disableCompanyCode = currentUser?.role !== Role.SUPER_ADMIN;
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: type === 'add' ? defaultAddValues : defaultUpdateValues(updatingUser),
  });

  const roleOptions = getRoleOptions();

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-3'
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values);
          setOpen(false);
        })}
      >
        <div className='flex items-center gap-3'>
          <div className='flex-1'>
            <FormInputItem<typeof formSchema>
              control={form.control}
              name='firstName'
              label='FirstName'
              placeholder='First Name'
            />
          </div>

          <div className='flex-1'>
            <FormInputItem<typeof formSchema>
              control={form.control}
              name='lastName'
              label='LastName'
              placeholder='Last Name'
            />
          </div>
        </div>
        <div>
          <FormInputItem<typeof formSchema>
            control={form.control}
            name='email'
            label='Email'
            placeholder='Email'
          />
        </div>
        <div>
          <FormInputItem<typeof formSchema>
            control={form.control}
            name='password'
            label='Password'
            placeholder='Password'
            type='password'
          />
        </div>

        <div>
          <FormSelectItem<typeof formSchema>
            control={form.control}
            name='role'
            options={roleOptions}
            label='Role'
            placeholder='Select Role'
            disabled={disableUpdateRole}
          />
        </div>

        <div>
          <FormInputItem<typeof formSchema>
            control={form.control}
            name='companyCode'
            label='Company Code'
            placeholder='Company Code'
            disabled={disableCompanyCode}
          />
        </div>

        <DialogFooter className='mt-3'>
          <div className='w-full flex flex-col md:flex-row justify-between gap-2'>
            {type === 'update' && (
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
            )}

            <div
              className={cn(
                'flex flex-col md:flex-row items-center gap-2',
                type === 'add' && 'ml-auto'
              )}
            >
              <Button
                className='block w-full md:w-auto md:inline my-2 md:my-auto order-1 md:-order-1'
                onClick={() => setOpen(false)}
                type='button'
                variant={'outline'}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='block w-full md:w-auto md:ml-auto'
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Submitting...'
                  : type === 'add'
                    ? 'Add User'
                    : 'Update User'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
