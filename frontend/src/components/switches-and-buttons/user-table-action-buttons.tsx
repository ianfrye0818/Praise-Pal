'use client';

import { Button } from '@/components/ui/button';
import ConfirmationDialog from '../dialogs/confirmation-dialog';
import { User } from '@/types';
import useDeleteCompanyUser from '@/hooks/api/useCompayUsers/useRestoreCompanyUser';
import useRestoreCompanyUser from '@/hooks/api/useCompayUsers/useRestoreCompanyUser';

interface UserTableActionButtonsProps {
  updatingUser: User;
}

export default function UserTableActionButtons({ updatingUser }: UserTableActionButtonsProps) {
  const { mutateAsync: softDeleteUser } = useDeleteCompanyUser();
  const { mutateAsync: restoreSoftDeletedUser } = useRestoreCompanyUser();
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
          <Button variant='destructive'>Delete</Button>
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
          <Button variant='confirm'>Restore</Button>
        </ConfirmationDialog>
      )}
    </div>
  );
}
