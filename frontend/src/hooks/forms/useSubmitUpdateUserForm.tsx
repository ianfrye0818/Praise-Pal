import { Role, UpdateUserProps, User } from '@/types';
import useUpdateCompanyUser from '../api/useCompayUsers/useUpdateCompanyUser';

export default function useSubmitUpdateUserForm(currentUser: User | null, user: User) {
  const { mutateAsync: updateUser } = useUpdateCompanyUser();
  const onSubmit = async (data: UpdateUserProps) => {
    const { role: _, ...rest } = data;

    try {
      await updateUser({
        companyCode: currentUser?.companyCode as string,
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
