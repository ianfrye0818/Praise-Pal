import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { addKudoFormSchema } from '@/zodSchemas';
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
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import useGetCompanyUsers from '@/hooks/api/useCompayUsers/useGetCompanyUsers';
import { ADD_KUDOS_DIALOG_FORM_DEFAULT_VALUES } from '@/constants';
import useSubmitAddKudosForm from '@/hooks/forms/useSubmitAddKudosForm';
import { FormInputItem } from '../forms/form-input-item';
import { FormTextAreaItem } from '../forms/form-text-area-item';
import ComboBox from '../forms/find-receipint-combo-box';
import { CheckBoxInputItem } from '../forms/form-checkbox-input-item';
import { QueryKey } from '@tanstack/react-query';

export default function AddKudosDialog({
  children,
  queryKey,
}: {
  children?: React.ReactNode;
  queryKey?: QueryKey;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth().state;
  const { data: users } = useGetCompanyUsers({
    companyCode: user?.companyCode,
  });

  const form = useForm<z.infer<typeof addKudoFormSchema>>({
    resolver: zodResolver(addKudoFormSchema),
    defaultValues: ADD_KUDOS_DIALOG_FORM_DEFAULT_VALUES(
      user?.userId as string,
      user?.companyCode as string
    ),
  });

  const onSubmit = useSubmitAddKudosForm(user!, queryKey);

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            className='ml-auto'
            variant='default'
          >
            Add Kudo
          </Button>
        )}
      </DialogTrigger>
      <Form {...form}>
        <form>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Add a Kudo</DialogTitle>
              <DialogDescription>Recognize your teammates for their great work.</DialogDescription>
            </DialogHeader>

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
                            users={users || []}
                            currentUser={user}
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
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
