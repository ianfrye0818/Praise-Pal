import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '../ui/button';
import { useState } from 'react';
import * as z from 'zod';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { addKudoFormSchema } from '@/zodSchemas';
import { User } from '@/types';
import { getUserDisplayName } from '@/lib/utils';

interface ComboBoxProps {
  field: ControllerRenderProps<z.infer<typeof addKudoFormSchema>, 'receiverId'>;
  form: UseFormReturn<z.infer<typeof addKudoFormSchema>>;
  users: User[];
  currentUser: User | null;
}

export default function ComboBox({ field, form, users, currentUser }: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  users = users.filter((r) => r.userId !== currentUser?.userId);

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
          <CommandList>
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
