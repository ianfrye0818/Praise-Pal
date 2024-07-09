import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import useAdminMode from '@/hooks/useAdminMode';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';

export default function SetPathLocaiton() {
  const { history } = useRouter();
  const { pathname } = history.location;
  const { setAdminMode } = useAdminMode();
  const { user } = useAuth().state;

  const canSavePath = pathname !== '/sign-in' && pathname !== '/sign-up';

  useEffect(() => {
    if (canSavePath) {
      sessionStorage.setItem('lastPath', pathname);
    }
    if (pathname.includes('admin') && user?.role !== Role.USER) {
      setAdminMode(true);
    } else {
      setAdminMode(false);
    }
  }, [pathname, canSavePath]);

  return null;
}
