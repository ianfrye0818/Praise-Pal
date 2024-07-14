import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { capitalizeString, cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { FormInputItem } from '@/components/forms/form-input-item';
import FormSelectItem from '@/components/forms/form-select-item';
import * as z from 'zod';
import { useToast } from '../ui/use-toast';
import DeleteConfirmDialog from '../dialogs/delete-account-confirmation';
import { Role, User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { addUserSchema, updateUserSchema } from '@/zodSchemas';
import useUpdateCompanyUser from '@/hooks/api/useCompayUsers/useUpdateCompanyUser';
import useCreateCompanyUser from '@/hooks/api/useCompayUsers/useCreateCompanyUser';
import useDeleteCompanyUser from '@/hooks/api/useCompayUsers/useDeleteCompanyUser';

interface AddUpdateUserFormProps {
  type: 'add' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updatingUser?: User;
}

export default function AddUpdateUserForm({ type, setOpen, updatingUser }: AddUpdateUserFormProps) {
  const { user: currentUser } = useAuth().state;
  const formSchema = type === 'add' ? addUserSchema : updateUserSchema;
  const { toast } = useToast();
  const { mutateAsync: updateUser } = useUpdateCompanyUser();
  const { mutateAsync: createUser } = useCreateCompanyUser();
  const { mutateAsync: deleteUser } = useDeleteCompanyUser();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues:
      type === 'update'
        ? {
            email: updatingUser?.email,
            companyCode: updatingUser?.companyCode,
            firstName: updatingUser?.firstName,
            lastName: updatingUser?.lastName,
            role: updatingUser?.role,
          }
        : {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: Role.USER,
            companyCode: '',
          },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === 'add') {
        await createUser(data as z.infer<typeof addUserSchema>);
        toast({ title: 'Success', description: 'User created successfully' });
      }
      if (type === 'update') {
        await updateUser({
          companyCode: updatingUser?.companyCode as string,
          currentUser: currentUser as User,
          userToUpdateId: updatingUser?.userId as string,
          payload: data as z.infer<typeof updateUserSchema>,
        });
        toast({ title: 'Success', description: 'User updated successfully' });
      }
    } catch (error) {
      console.error(['onSubmit'], error);
      toast({ title: 'Error', description: 'Error updating user', variant: 'destructive' });
    }
  };

  const roleOptions = Object.values(Role).map((role) => ({
    label: capitalizeString(role),
    value: role,
  }));

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
          />
        </div>

        <div>
          <FormInputItem<typeof formSchema>
            control={form.control}
            name='companyCode'
            label='Company Code'
            placeholder='Company Code'
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
