import { logout } from '@/api/auth-actions';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

import { useNavigate } from '@tanstack/react-router';
import { LogOutIcon } from 'lucide-react';

export default function LogoutButton() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  return (
    <Button
      variant={'ghost'}
      size='default'
      onClick={async () => {
        await logout(dispatch);
        await navigate({ to: '/sign-in' });
      }}
    >
      <LogOutIcon />
    </Button>
  );
}
