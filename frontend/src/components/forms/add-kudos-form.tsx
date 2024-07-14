import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { addKudoFormSchema } from '@/zodSchemas';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { ADD_KUDOS_DIALOG_FORM_DEFAULT_VALUES } from '@/constants';
import useSubmitAddKudosForm from '@/hooks/forms/useSubmitAddKudosForm';
import { FormInputItem } from './form-input-item';
import { FormTextAreaItem } from './form-text-area-item';
import ComboBox from './receiver-combo-box';
import { CheckBoxInputItem } from './form-checkbox-input-item';
import { QueryKey } from '@tanstack/react-query';
import { DialogFooter } from '../ui/dialog';

interface AddKudosFormProps {
  queryKey?: QueryKey;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddKudosForm({ queryKey, setOpen }: AddKudosFormProps) {
  const { user: currentUser } = useAuth().state;
  const form = useForm<z.infer<typeof addKudoFormSchema>>({
    resolver: zodResolver(addKudoFormSchema),
    defaultValues: ADD_KUDOS_DIALOG_FORM_DEFAULT_VALUES(
      currentUser?.userId as string,
      currentUser?.companyCode as string
    ),
  });

  const onSubmit = useSubmitAddKudosForm(currentUser!, queryKey);
  return (
    <Form {...form}>
      <form>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <FormInputItem<typeof addKudoFormSchema>
              control={form.control}
              label='Title'
              placeholder='Great job on that project!'
              type='text'
              name='title'
            />
          </div>
          <div className='grid gap-2'>
            <FormTextAreaItem<typeof addKudoFormSchema>
              control={form.control}
              label='Message'
              placeholder='Let them know what they did well!'
              name='message'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='recipient'>Recipient</Label>
            <div className='relative'>
              <FormField
                control={form.control}
                name='receiverId'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ComboBox
                        field={field}
                        form={form}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <CheckBoxInputItem<typeof addKudoFormSchema>
              control={form.control}
              label='Send Anonymous'
              name='isAnonymous'
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            className='md:mr-auto my-2 md:my-auto'
            onClick={() => {
              setOpen(false);
              form.reset();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit((values) => {
              onSubmit(values);
              setOpen(false);
            })}
            type='submit'
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? 'Sending...' : 'Add Kudo'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
