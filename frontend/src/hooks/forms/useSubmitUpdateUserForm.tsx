import { Role, User } from '@/types';
import { updateUserFormSchema } from '@/zodSchemas';
import * as z from 'zod';
import useUpdateCompanyUser from '../api/useCompayUsers/useUpdateCompanyUser';

export default function useSubmitUpdateUserForm(currentUser: User | null, user: User) {
  const { mutateAsync: updateUser } = useUpdateCompanyUser();
  const onSubmit = async (data: z.infer<typeof updateUserFormSchema>) => {
    const { role: _, ...rest } = data;

    try {
      await updateUser({
        companyId: currentUser?.companyId as string,
        userToUpdateId: user.userId,
        payload: currentUser?.role === Role.COMPANY_OWNER ? data : rest,
        currentUser: currentUser as User,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return onSubmit;
}
