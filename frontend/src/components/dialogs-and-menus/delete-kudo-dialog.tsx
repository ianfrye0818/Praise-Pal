import useDeleteKudo from '@/hooks/api/useKudos/useDeleteKudo';
import { TKudos } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { QueryKey } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import ConfirmationDialog from './confirmation-dialog';

interface DialogDemoProps {
  setMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  kudo: TKudos;
  children?: React.ReactNode;
  queryKey?: QueryKey;
}

export function DeleteKudoDialog({ setMenuOpen, kudo, children, queryKey }: DialogDemoProps) {
  const { user: currentUser } = useAuth().state;
  const { mutateAsync: deleteKudo } = useDeleteKudo(queryKey);
  const router = useRouter();
  const { pathname } = router.history.location;

  const handleDeleteKudo = async () => {
    deleteKudo({ kudoId: kudo.id, companyCode: currentUser?.companyCode as string });
    if (pathname === `/kudos/${kudo.id}`) {
      router.history.back();
    }
    setMenuOpen && setMenuOpen(false);
  };

  return (
    <ConfirmationDialog
      action={handleDeleteKudo}
      description='Are you sure you want to delete your kudo? This action cannot be undone.'
      title='Delete Kudo?'
      actionButtonText='Delete Kudo'
      cancelButtonText='Cancel'
      actionButtonVariant={'destructive'}
    >
      {children}
    </ConfirmationDialog>
  );
}
