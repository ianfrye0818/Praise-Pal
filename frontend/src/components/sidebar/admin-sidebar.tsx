import { Link } from '@tanstack/react-router';
import { adminSideBarLink, sidebarLinks } from '@/constants';
import NavBarLink from '@/components/sidebar/nav-bar-link';
import SideBarFooter from './sidebar-footer';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';
import { ArrowLeft } from 'lucide-react';

export default function AdminSideBar() {
  const { isAdmin } = useAuth().state;

  return (
    <section className='fixed h-screen left-0 top-0 flex pt-8 max-lg:hidden sm:p-4 xl:p-6 2xl:w-[300px] flex-col justify-between border-r border-zinc-200 p-3 bg-gray-100 md:w-[275px]'>
      <nav className='flex flex-col gap-4'>
        <Link
          to='/'
          className='mb-12 cursor-pointer items-center gap-2 flex'
        >
          {/* <h1 className='text-4xl font-bold w-full'>Praise Pal</h1>
           */}
          <img
            src={logo}
            alt='logo'
            className='w-full object-contain'
          />
        </Link>
        <Link>
          <ArrowLeft />
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
