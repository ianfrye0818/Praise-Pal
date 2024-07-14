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
import { DeleteKudoDialog } from '../dialogs-and-menus/delete-kudo-dialog';
import { QueryKey } from '@tanstack/react-query';
import EditKudosForm from '../forms/edit-kudos-form';
import FormDialog from './form-dialog';

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
          <FormDialog
            form={EditKudosForm}
            title='Edit Your Kudo'
            description='Make Edits and Resend.'
            formProps={{ kudo, setMenuOpen, querKey }}
          >
            <Button
              className='w-full px-2 flex justify-start'
              variant={'ghost'}
            >
              Edit Kudo
            </Button>
          </FormDialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteKudoDialog
            kudo={kudo}
            setMenuOpen={setMenuOpen}
            queryKey={querKey}
          >
            <Button
              className='w-full px-2 flex justify-start'
              variant={'ghost'}
            >
              Delete
            </Button>
          </DeleteKudoDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
