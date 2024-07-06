import { updateCompanyFormSchema } from '@/zodSchemas';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form } from '../ui/form';
import { FormInputItem } from './form-input-item';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { UPDATE_COMPANY_DIALOG_DEFAULT_VALUES } from '@/constants';

import { Company } from '@/types';
import useUpdateCompany from '@/hooks/api/useCompany/useUpdateCompany';
import { CustomError } from '@/errors';

export function UpdateCompanyDialogForm({
  updatingCompany,
  setError,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updatingCompany: Company;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const form = useForm<z.infer<typeof updateCompanyFormSchema>>({
    resolver: zodResolver(updateCompanyFormSchema),
    defaultValues: UPDATE_COMPANY_DIALOG_DEFAULT_VALUES(updatingCompany),
  });
  const { mutateAsync: updateCompany } = useUpdateCompany();

  async function onSubmit(values: z.infer<typeof updateCompanyFormSchema>) {
    setError(null);
    try {
      await updateCompany({ ...values, id: updatingCompany.id });
    } catch (error) {
      setError((error as unknown as CustomError).message || 'An error has occured');
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Update Company Info</DialogTitle>
        <DialogDescription>Update your company's information.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          className='flex flex-col gap-4'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='space-y-2'>
            <FormInputItem<typeof updateCompanyFormSchema>
              control={form.control}
              name='name'
              label='Company Name'
              placeholder='Company Name'
            />
          </div>
          <div className='space-y-2'>
            <FormInputItem<typeof updateCompanyFormSchema>
              control={form.control}
              name='address'
              label='Address'
              placeholder='Street Address'
            />
          </div>
          <div className='flex gap-1'>
            <div className='space-y-2 flex-2'>
              <FormInputItem<typeof updateCompanyFormSchema>
                control={form.control}
                name='city'
                label='City'
                placeholder='city'
              />
            </div>
            <div className='space-y-2  flex-1'>
              <FormInputItem<typeof updateCompanyFormSchema>
                control={form.control}
                maxLength={2}
                name='state'
                label='State'
                placeholder='State'
              />
            </div>
            <div className='space-y-2 flex-1'>
              <FormInputItem<typeof updateCompanyFormSchema>
                control={form.control}
                maxLength={5}
                minLength={5}
                name='zip'
                label='Zip'
                placeholder='Zip'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <FormInputItem<typeof updateCompanyFormSchema>
              control={form.control}
              name='phone'
              label='Phone'
              placeholder='Phone'
            />
          </div>
          <DialogFooter className='flex justify-end'>
            <Button
              disabled={!form.formState.isValid}
              type='submit'
            >
              Update Company
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
