import { updateUserFormSchema } from '@/zodSchemas';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form } from '../ui/form';
import { FormInputItem } from './form-input-item';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import FormSelectItem from './form-select-item';
import { getRoleDropDownOptions } from '@/lib/utils';
import { UPDATE_USER_DIALOG_DEFAULT_VALUES } from '@/constants';
import useSubmitUpdateUserForm from '@/hooks/forms/useSubmitUpdateUserForm';

export function UpdateAccountDialog({
  updatingUser,
  setOpen,
  setDeleting,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  updatingUser: User;
}) {
  const { isCompanyOwner, user: currentUser } = useAuth().state;

  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: UPDATE_USER_DIALOG_DEFAULT_VALUES(updatingUser),
  });

  const roleOptions = getRoleDropDownOptions();
  const canUpdateRole = isCompanyOwner && currentUser?.userId !== updatingUser.userId;

  const onSubmit = useSubmitUpdateUserForm(currentUser, updatingUser);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Update User Info</DialogTitle>
        <DialogDescription>Update your user information.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          className='grid gap-4'
          onSubmit={form.handleSubmit((values) => {
            onSubmit(values);
            setOpen(false);
          })}
        >
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <FormInputItem<typeof updateUserFormSchema>
                control={form.control}
                name='firstName'
                label='First Name'
                placeholder='John'
              />
            </div>
            <div className='space-y-2'>
              <FormInputItem<typeof updateUserFormSchema>
                control={form.control}
                name='lastName'
                label='Last Name'
                placeholder='Doe'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <FormInputItem<typeof updateUserFormSchema>
              control={form.control}
              name='displayName'
              label='Display Name'
              placeholder='John Doe'
            />
          </div>
          <div className='space-y-2'>
            <FormInputItem<typeof updateUserFormSchema>
              control={form.control}
              name='email'
              label='Email'
              placeholder='john@example.com'
            />
          </div>
          {canUpdateRole && (
            <FormSelectItem<typeof updateUserFormSchema>
              control={form.control}
              name='role'
              options={roleOptions}
              label='Role'
            />
          )}
          <DialogFooter>
            <div className='w-full flex justify-between'>
              <Button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleting(true);
                }}
                className='bg-red-500 hover:bg-red-600'
              >
                Delete Account
              </Button>
              <div className='flex items-center gap-2'>
                <Button variant={'outline'}>Cancel</Button>
                <Button
                  type='submit'
                  className='ml-auto'
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
