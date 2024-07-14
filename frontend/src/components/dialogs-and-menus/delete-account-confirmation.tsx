import { User } from '@/types';
import ConfirmationDialog from './confirmation-dialog';
import DeleteConfirmationForm from '../forms/delete-confirmation-form';
import { Button } from '../ui/button';
import { useState } from 'react';

interface DeleteAccountConfirmationProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitting: boolean;
  user: User;
  currentUser: User;
  action: () => void;
}

export default function DeleteConfirmDialog({ action, user }: DeleteAccountConfirmationProps) {
  const [verifyEmail, setVerifyEmail] = useState('');
  return (
    <>
      <ConfirmationDialog
        action={action}
        title={'Are you sure you want to delete?'}
        description='Are you sure you want to delete this account?'
        actionButtonText='Delete'
        actionButtonVariant={'destructive'}
        content={DeleteConfirmationForm}
        contentProps={{ email: user.email, verifyEmail, setVerifyEmail }}
      >
        <Button
          onClick={action}
          variant={'destructive'}
        >
          Delete Account
        </Button>
      </ConfirmationDialog>
    </>
  );
}
