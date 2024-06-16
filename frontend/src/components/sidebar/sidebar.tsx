import { Link } from '@tanstack/react-router';
import { adminSideBarLink, sidebarLinks } from '@/constants';
import NavBarLink from '@/components/sidebar/nav-bar-link';

// import { useAuth } from '@/hooks/useAuth';
import SideBarFooter from './sidebar-footer';

export default function Sidebar() {
  // TODO: update admin check
  // const { isAdmin } = useAuth();
  const isAdmin = true;

  return (
    <section className='h-full fixed hidden lg:flex flex-col justify-between border-r border-zinc-200 p-3 bg-gray-100 md:w-60'>
      <nav className='flex flex-col gap-4'>
        <Link
          to='/'
          className='mb-12 cursor-pointer items-center gap-2 flex'
        >
          <h1 className='text-4xl font-bold w-full'>Praise Pal</h1>
        </Link>
        {sidebarLinks.map((link) => (
          <NavBarLink
            key={link.label}
            link={link}
          />
        ))}
        {isAdmin && <NavBarLink link={adminSideBarLink} />}
      </nav>

      <SideBarFooter />
    </section>
  );
}