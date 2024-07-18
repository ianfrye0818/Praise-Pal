import { Button } from '@/components/ui/button';
import ConfirmationDialog from '../dialogs-and-menus/confirmation-dialog';
import useRestoreCompanyUser from '@/hooks/api/useCompayUsers/useRestoreCompanyUser';
import { User } from '@/types';
import useDeleteCompanyUser from '@/hooks/api/useCompayUsers/useDeleteCompanyUser';

interface UserTableActionButtonsProps {
  updatingUser: User;
  disabled: boolean;
}

export default function UserTableActionButtons({
  updatingUser,
  disabled,
}: UserTableActionButtonsProps) {
  const { mutateAsync: softDeleteUser, isPending: useDeleteCompanyUserIsPending } =
    useDeleteCompanyUser();
  const { mutateAsync: restoreSoftDeletedUser, isPending: useRestoreCompanyUserIsPending } =
    useRestoreCompanyUser();

  return (
    <div>
      {updatingUser.deletedAt === null ? (
        <ConfirmationDialog
          title='Delete User'
          description='Are you sure you want to delete this user?'
          actionButtonText='Delete User'
          actionButtonVariant={'destructive'}
          action={async () =>
            await softDeleteUser({
              companyCode: updatingUser.companyCode,
              userId: updatingUser.userId,
            })
          }
        >
          <Button
            variant='destructive'
            disabled={disabled || useDeleteCompanyUserIsPending}
          >
            Delete
          </Button>
        </ConfirmationDialog>
      ) : (
        <ConfirmationDialog
          title='Restore User'
          description='Are you sure you want to restore this user?'
          actionButtonText='Restore User'
          actionButtonVariant={'confirm'}
          action={() =>
            restoreSoftDeletedUser({
              companyCode: updatingUser.companyCode,
              userId: updatingUser.userId,
            })
          }
        >
          <Button
            variant='confirm'
            disabled={disabled || useRestoreCompanyUserIsPending}
          >
            Restore
          </Button>
        </ConfirmationDialog>
      )}
    </div>
  );
}
