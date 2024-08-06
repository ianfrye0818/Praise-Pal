import { sidebarLinks } from '@/constants';
import { Link } from '@tanstack/react-router';
import NavBarLink from '../ui/nav-bar-link';
import logo from '@/assets/logo.png';

export default function NavLinksList({
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
        className='mb-12 cursor-pointer items-center gap-2 flex justify-center'
      >
        <img
          src={logo}
          alt='logo'
          className='w-[75%] object-contain'
        />
      </Link>
      {sidebarLinks.map((link) => (
        <NavBarLink
          onClick={type === 'mobile' ? () => setMenuOpen!(false) : undefined}
          key={link.label}
          link={link}
        />
      ))}
    </nav>
  );
}
