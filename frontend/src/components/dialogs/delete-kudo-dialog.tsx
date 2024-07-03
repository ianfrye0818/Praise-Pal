import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import useDeleteKudo from '@/hooks/api/useKudos/useDeleteKudo';
import { TKudos } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface DialogDemoProps {
  setMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  kudo: TKudos;
  children?: React.ReactNode;
}

export function DeleteKudoDialog({ setMenuOpen, kudo, children }: DialogDemoProps) {
  const { user: currentUser } = useAuth().state;
  const [open, setOpen] = useState(false);
  function handleCloseMenu() {
    setOpen(false);
    if (setMenuOpen) {
      setMenuOpen(false);
    }
  }

  const { mutate: deleteKudo } = useDeleteKudo();

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (setMenuOpen) {
          setMenuOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant='ghost'
            className='w-full px-2 flex justify-start'
          >
            Delete Kudo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Kudo?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your kudo? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='flex justify-end gap-4'>
            <Button
              variant='outline'
              className='mr-auto'
              onClick={() => {
                handleCloseMenu();
              }}
            >
              Cancel
            </Button>
            <Button
              className='bg-red-500 hover:bg-red-600'
              onClick={() => {
                deleteKudo({ kudoId: kudo.id, companyId: currentUser?.companyId as string });
                handleCloseMenu();
              }}
            >
              Delete Kudo
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
