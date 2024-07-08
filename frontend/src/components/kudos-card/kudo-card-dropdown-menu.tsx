import { MenuSquareIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { TKudos } from '@/types';

import { useState } from 'react';
import EditKudosDialog from '../dialogs/edit-kudos-dialog';
import { DeleteKudoDialog } from '../dialogs/delete-kudo-dialog';
import { QueryKey } from '@tanstack/react-query';

interface KudoCardDropDownMenuProps {
  kudo: TKudos;
  querKey?: QueryKey;
}

export default function KudoCardDropDownMenu({ kudo, querKey }: KudoCardDropDownMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <DropdownMenu
      open={menuOpen}
      onOpenChange={(open) => setMenuOpen(open)}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='text-gray-400 hover:text-gray-900 dark:hover:text-gray-50'
        >
          <MenuSquareIcon className='h-4 w-4' />
          <span className='sr-only'>More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='bg-white p-3 cursor-pointer'
        align='end'
      >
        <DropdownMenuItem asChild>
          <EditKudosDialog
            kudo={kudo}
            setMenuOpen={setMenuOpen}
            queryKey={querKey}
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteKudoDialog
            kudo={kudo}
            setMenuOpen={setMenuOpen}
            queryKey={querKey}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
