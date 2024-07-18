import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { editKudosFormSchema } from '@/zodSchemas';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '../ui/form';
import { EDIT_KUDOS_DIALOG_FORM_DEFAULT_VALUES } from '@/constants';
import useSubmitEditKudosForm from '@/hooks/forms/useSubmitEditKudosForm';
import { FormInputItem } from './form-input-item';
import { FormTextAreaItem } from './form-text-area-item';
import { QueryKey } from '@tanstack/react-query';
import { TKudos } from '@/types';

interface EditKudosFormProps {
  kudo: TKudos;
  queryKey?: QueryKey;
  isSingleKudo?: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditKudosForm({ kudo, setMenuOpen, queryKey }: EditKudosFormProps) {
  const form = useForm<z.infer<typeof editKudosFormSchema>>({
    resolver: zodResolver(editKudosFormSchema),
    defaultValues: EDIT_KUDOS_DIALOG_FORM_DEFAULT_VALUES(kudo),
  });

  const onSubmit = useSubmitEditKudosForm(queryKey);

  return (
    <Form {...form}>
      <form>
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
            className='md:mr-auto my-2 md:my-auto'
            onClick={() => {
              setMenuOpen(false);
              form.reset();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(async (values) => {
              await onSubmit(values);
              setMenuOpen(false);
            })}
            type='submit'
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? 'Sending...' : 'Update Kudo'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
