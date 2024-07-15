import * as z from 'zod';
import { User } from '@/types';
import useErrorToast from '../useErrorToast';
import useSuccessToast from '../useSuccessToast';
import useUpdateCompanyUser from '../api/useCompayUsers/useUpdateCompanyUser';
import useCreateCompanyUser from '../api/useCompayUsers/useCreateCompanyUser';
import { addUserSchema, updateUserSchema } from '@/zodSchemas';
import { isCustomError } from '@/errors';
import useUpdateCurrentUser from '../api/useCompayUsers/useUpdateCurrentUser';
import { UseFormReturn } from 'react-hook-form';

interface SubmitUpdateCompanyUserFormProps {
  formSchema: z.ZodObject<any, any>;
  type: 'add' | 'update';
  updatingUser?: User;
  currentUser: User;
  form?: UseFormReturn<z.infer<typeof addUserSchema>>;
}

export default function useSubmitAddUpdateCompanyUserForm({
  formSchema,
  form,
  type,
  updatingUser,
  currentUser,
}: SubmitUpdateCompanyUserFormProps) {
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const { mutateAsync: updateUser } = useUpdateCompanyUser();
  const { mutateAsync: updateCurrentUser } = useUpdateCurrentUser();
  const { mutateAsync: createUser } = useCreateCompanyUser();
  const updatingCurrentUser = updatingUser?.userId === currentUser.userId;
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === 'add') {
        if (data.password !== data.confirmPassword) {
          form?.setError('confirmPassword', { message: 'Passwords do not match' });
          return;
        }
        await createUser(data as z.infer<typeof addUserSchema>);
        successToast({ title: 'Success', message: 'User created successfully' });
      }
      if (type === 'update') {
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
      }
    } catch (error) {
      console.error(['onSubmit'], error);
      if (isCustomError(error)) {
        errorToast({ title: 'Error', message: error.message });
      }
      errorToast({ title: 'Error', message: 'Error updating user' });
    }
  };

  return onSubmit;
}
