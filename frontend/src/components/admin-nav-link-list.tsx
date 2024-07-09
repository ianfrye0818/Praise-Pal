import { adminSidebarLinks } from '@/constants';
import { Link } from '@tanstack/react-router';
import NavBarLink from './sidebar/nav-bar-link';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

import logo from '@/assets/logo.png';

export default function AdminNavLinkList({
  setMenuOpen,
  type = 'desktop',
}: {
  setMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  type?: 'desktop' | 'mobile';
}) {
  // const { setAdminMode } = useAdminMode();
  return (
    <nav className='flex flex-col gap-4'>
      <Link
        to='/'
        className='mb-12 cursor-pointer items-center gap-2 flex'
      >
        <img
          src={logo}
          alt='logo'
          className='w-full object-contain'
        />
      </Link>

      {adminSidebarLinks.map((link) => (
        <NavBarLink
          onClick={type === 'mobile' ? () => setMenuOpen!(false) : undefined}
          key={link.label}
          link={link}
        />
      ))}
      <Button
        variant={'ghost'}
        className='justify-start p-2 '
        onClick={async () => {
          // setAdminMode(false);
          type === 'mobile' && setMenuOpen!(false);
        }}
        asChild
      >
        <Link to='/'>
          <ArrowLeft />
          Back
        </Link>
      </Button>
    </nav>
  );
}
