import { User } from '@/types';
import { Button } from '../ui/button';
import DeleteConfirmationForm from '../forms/delete-confirmation-form';
import FormDialog from './form-dialog';

interface DeleteAccountConfirmationProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitting: boolean;
  user: User;
  currentUser: User;
  action: () => void;
}

export default function DeleteConfirmDialog({ action, user }: DeleteAccountConfirmationProps) {
  return (
    <>
      <FormDialog
        title={'Are you sure you want to delete?'}
        description='Are you sure you want to delete this account?'
        form={DeleteConfirmationForm}
        formProps={{ email: user.email, action: action }}
      >
        <Button variant={'destructive'}>Delete Account</Button>
      </FormDialog>
    </>
  );
}
