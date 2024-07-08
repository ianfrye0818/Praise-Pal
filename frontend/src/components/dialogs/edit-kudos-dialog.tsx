import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { editKudosFormSchema } from '@/zodSchemas';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '../ui/form';

import { EDIT_KUDOS_DIALOG_FORM_DEFAULT_VALUES } from '@/constants';

import useSubmitEditKudosForm from '@/hooks/forms/useSubmitEditKudosForm';
import { FormInputItem } from '../forms/form-input-item';
import { FormTextAreaItem } from '../forms/form-text-area-item';
import { QueryKey } from '@tanstack/react-query';
import { TKudos } from '@/types';

export interface EditKudosDialogProps {
  kudo: TKudos;
  className?: string;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSingleKudo?: boolean;
  queryKey?: QueryKey;
}

export default function EditKudosDialog({ kudo, setMenuOpen, queryKey }: EditKudosDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof editKudosFormSchema>>({
    resolver: zodResolver(editKudosFormSchema),
    defaultValues: EDIT_KUDOS_DIALOG_FORM_DEFAULT_VALUES(kudo),
  });

  function handleCloseMenus() {
    setOpen(false);
    setMenuOpen(false);
  }

  const onSubmit = useSubmitEditKudosForm(queryKey);

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        form.reset();
        setOpen(open);
        setMenuOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='w-full px-2 flex justify-start'
        >
          Edit Kudo
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <form>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Edit Your Kudo</DialogTitle>
              <DialogDescription>Make Edits and Resend.</DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <FormInputItem<typeof editKudosFormSchema>
                  control={form.control}
                  label='Title'
                  placeholder='Great job on that project!'
                  type='text'
                  name='title'
                />
              </div>
              <div className='grid gap-2'>
                <FormTextAreaItem<typeof editKudosFormSchema>
                  control={form.control}
                  label='Message'
                  placeholder='Let them know what they did well!'
                  name='message'
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                className='mr-auto'
                onClick={() => {
                  handleCloseMenus();
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(async (values) => {
                  await onSubmit(values);
                  handleCloseMenus();
                })}
                type='submit'
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                {form.formState.isSubmitting ? 'Sending...' : 'Update Kudo'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
