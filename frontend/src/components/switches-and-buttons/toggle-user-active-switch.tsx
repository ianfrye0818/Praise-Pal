import { Toggle } from '@/components/ui/toggle';
import useErrorToast from '@/hooks/useErrorToast';
import useUpdateCompanyUser from '@/hooks/api/useCompayUsers/useUpdateCompanyUser';
import { User } from '@/types';
import { QueryKeys } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

interface ToggleActiveSwitchProps {
  user: User;
  take?: number;
  disabled?: boolean;
}

export default function ToggleActiveSwitch({ user, take, disabled }: ToggleActiveSwitchProps) {
  const { user: currentUser } = useAuth().state;
  const { errorToast } = useErrorToast();
  const { mutateAsync: toggleUserActive } = useUpdateCompanyUser({
    queryKey: take ? QueryKeys.limitUsers(take) : QueryKeys.allUsers,
  });

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
        disabled={disabled || user.deletedAt !== null}
        pressed={user.isActive}
        onPressedChange={handleToggleUserActiveStatus}
      >
        {user.isActive ? 'Active' : 'Inactive'}
      </Toggle>
    </>
  );
}
