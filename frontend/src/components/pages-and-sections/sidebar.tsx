import SideBarFooter from '../pages-and-sections/sidebar-footer';
import NavLinksList from '../lists/nav-links-list';
import useAdminMode from '@/hooks/useAdminMode';
import AdminNavLinkList from '../lists/admin-nav-link-list';

export default function Sidebar() {
  const { adminMode } = useAdminMode();

  return (
    <section className='fixed h-dvh left-0 top-0 flex pt-8 max-lg:hidden sm:p-4 xl:p-6 2xl:w-[300px] flex-col justify-between border-r border-zinc-200 p-3 bg-gray-100 md:w-[275px]'>
      {adminMode ? <AdminNavLinkList /> : <NavLinksList />}
      <SideBarFooter />
    </section>
  );
}
