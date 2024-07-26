import { adminSidebarLinks } from '@/constants';
import { Link } from '@tanstack/react-router';
import logo from '@/assets/logo.png';
import NavBarLink from '../ui/nav-bar-link';

export default function AdminNavLinkList({
  setMenuOpen,
  type = 'desktop',
}: {
  setMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  type?: 'desktop' | 'mobile';
}) {
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
    </nav>
  );
}
