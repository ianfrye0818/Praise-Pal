import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UpdateKudosSchema } from '@/zodSchemas';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '../ui/form';
import { UPDATE_KUDOS_DIALOG_FORM_DEFAULT_VALUES } from '@/constants';
import { FormInputItem } from './form-input-item';
import { FormTextAreaItem } from './form-text-area-item';
import { QueryKey } from '@tanstack/react-query';
import { TKudos } from '@/types';
import useSubmitUpdateKudosForm from '@/hooks/forms/useSubmitUpdateKudosForm';

interface UpdateKudosFormProps {
  kudo: TKudos;
  queryKey?: QueryKey;
  isSingleKudo?: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateKudosForm({ kudo, setMenuOpen, queryKey }: UpdateKudosFormProps) {
  const form = useForm<z.infer<typeof UpdateKudosSchema>>({
    resolver: zodResolver(UpdateKudosSchema),
    defaultValues: UPDATE_KUDOS_DIALOG_FORM_DEFAULT_VALUES(kudo),
  });

  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  const onSubmit = useSubmitUpdateKudosForm(queryKey);

  return (
    <Form {...form}>
      <form>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <FormInputItem<typeof UpdateKudosSchema>
              control={form.control}
              label='Title'
              placeholder='Great job on that project!'
              type='text'
              name='title'
            />
          </div>
          <div className='grid gap-2'>
            <FormTextAreaItem<typeof UpdateKudosSchema>
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
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Updating...' : 'Update Kudo'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
