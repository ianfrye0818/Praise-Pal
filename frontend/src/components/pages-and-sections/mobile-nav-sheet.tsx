import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import SideBarFooter from './sidebar-footer';
import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import NavLinksList from '../lists/nav-links-list';
import useAdminMode from '@/hooks/useAdminMode';
import AdminNavLinkList from '../lists/admin-nav-link-list';

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
          className='bg-white h-dvh flex flex-col gap-4 p-4'
        >
          <div className='flex h-full flex-col justify-between'>
            {adminMode ? (
              <AdminNavLinkList
                type={'mobile'}
                setMenuOpen={setOpen}
              />
            ) : (
              <NavLinksList
                type={'mobile'}
                setMenuOpen={setOpen}
              />
            )}
            <SideBarFooter />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
