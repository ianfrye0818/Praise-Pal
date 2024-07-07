import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import { DeleteAccountConfirmation } from './delete-account-confirmation';
import { UpdateAccountDialog } from '../forms/update-account-form';
import { User } from '@/types';

export default function UpdateUserDialog({
  updatingUser,
  trigger,
  currentUser,
  disabled,
}: {
  updatingUser: User;
  trigger?: React.ReactNode | string;
  currentUser: User;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setDeleting(false);
      }}
    >
      <DialogTrigger
        disabled={disabled}
        asChild
      >
        {trigger}
      </DialogTrigger>

      <DialogContent>
        {deleting ? (
          <DeleteAccountConfirmation
            user={updatingUser}
            currentUser={currentUser}
            setDeleting={setDeleting}
            setOpen={setOpen}
          />
        ) : (
          <UpdateAccountDialog
            updatingUser={updatingUser}
            setOpen={setOpen}
            setDeleting={setDeleting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
