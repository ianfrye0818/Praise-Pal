import { Toggle } from '@/components/ui/toggle';
import useErrorToast from '@/hooks/useErrorToast';
import useUpdateCompanyUser from '@/hooks/api/useCompayUsers/useUpdateCompanyUser';
import { Role, User } from '@/types';
import { QueryKeys } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

export default function ToggleActiveSwitch({ user, limit }: { user: User; limit?: number }) {
  const { user: currentUser } = useAuth().state;
  const { errorToast } = useErrorToast();
  const { mutateAsync: toggleUserActive } = useUpdateCompanyUser({
    queryKey: limit ? QueryKeys.limitUsers(limit) : QueryKeys.allUsers,
  });

  const canUpdateUser = currentUser!.role !== Role.USER;

  const handleToggleUserActiveStatus = async (isActive: boolean) => {
    try {
      await toggleUserActive({
        companyCode: user.companyCode,
        currentUser: currentUser as User,
        payload: { isActive },
        userToUpdateId: user.userId,
      });
    } catch (error) {
      console.error(error);
      errorToast({
        title: 'Failed to update user',
        message: 'An error occurred while updating the user. Please try again.',
      });
    }
  };

  return (
    <>
      <Toggle
        disabled={
          user.role === Role.SUPER_ADMIN || user.role === Role.COMPANY_OWNER || !canUpdateUser
        }
        pressed={user.isActive}
        onPressedChange={handleToggleUserActiveStatus}
      >
        {user.isActive ? 'Active' : 'Inactive'}
      </Toggle>
    </>
  );
}
