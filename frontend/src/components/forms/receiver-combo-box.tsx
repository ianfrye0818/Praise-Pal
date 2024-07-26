import * as z from 'zod';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '../ui/button';
import { useState } from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { AddKudosSchema } from '@/zodSchemas';
import { getUserDisplayName } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import useGetCompanyUsers from '@/hooks/api/useCompayUsers/useGetCompanyUsers';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface ReceiverComboBox {
  field: ControllerRenderProps<z.infer<typeof AddKudosSchema>, 'receiverId'>;
  form: UseFormReturn<z.infer<typeof AddKudosSchema>>;
}

export default function ReceiverComboBox({ field, form }: ReceiverComboBox) {
  const { user: currentUser } = useAuth().state;
  const [open, setOpen] = useState(false);
  const { data } = useGetCompanyUsers({
    companyCode: currentUser!.companyCode,
  });

  if (!data) return null;

  const users = data.filter(
    (r) => r.userId !== currentUser?.userId && r.isActive === true && r.deletedAt === null
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button variant='outline'>
          {field.value
            ? users.filter((r) => r.userId === field.value).map((r) => getUserDisplayName(r))
            : 'Select a recipient'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='min-w-[300px] p-0'>
        <Command className='rounded-lg border shadow-md'>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList className='bg-white0'>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {users.map((r) => {
                return (
                  <CommandItem
                    onSelect={() => {
                      form.setValue('receiverId', r.userId);
                      setOpen(false);
                      field.onChange(r.userId);
                    }}
                    value={getUserDisplayName(r)}
                    key={r.userId}
                  >
                    {getUserDisplayName(r)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
