import { useEffect } from 'react';
import { redirect, useLocation } from '@tanstack/react-router';

const GetLastPathName = () => {
  const lastPath = sessionStorage.getItem('lastPath') || null;
  const { pathname } = useLocation();

  useEffect(() => {
    if (lastPath && lastPath !== pathname) {
      redirect({ to: lastPath });
    }
  });
  return null;
};

export default GetLastPathName;
