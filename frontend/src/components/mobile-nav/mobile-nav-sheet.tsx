import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import SideBarFooter from '../sidebar/sidebar-footer';
import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import NavLinksList from '../nav-links-list';
import useAdminMode from '@/hooks/useAdminMode';
import AdminNavLinkList from '../admin-nav-link-list';

export default function MobileNavSheet() {
  const [open, setOpen] = useState(false);
  const { adminMode } = useAdminMode();

  return (
    <section>
      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetTrigger className='absolute top-2 left-2'>
          <MenuIcon className='w-8 h-8' />
        </SheetTrigger>
        <SheetContent
          side={'left'}
          className='bg-white w-[350px] h-full flex flex-col gap-4 p-4'
        >
          {/* <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Praise Pal</h1> */}
          <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto;'>
            {adminMode ? (
              <AdminNavLinkList setMenuOpen={setOpen} />
            ) : (
              <NavLinksList setMenuOpen={setOpen} />
            )}
            <SideBarFooter />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
