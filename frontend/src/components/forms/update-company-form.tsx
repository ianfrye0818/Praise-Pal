import * as z from 'zod';
import { updateCompanyFormSchema } from '@/zodSchemas';
import { useForm } from 'react-hook-form';
import { Form } from '../ui/form';
import { FormInputItem } from './form-input-item';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { UPDATE_COMPANY_DIALOG_DEFAULT_VALUES } from '@/constants';
import { Company } from '@/types';
import useUpdateCompany from '@/hooks/api/useCompany/useUpdateCompany';
import useErrorToast from '@/hooks/useErrorToast';
import { DialogFooter } from '../ui/dialog';

export function UpdateCompanyForm({
  updatingCompany,
  setOpen,
}: {
  updatingCompany: Company;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { errorToast } = useErrorToast();
  const form = useForm<z.infer<typeof updateCompanyFormSchema>>({
    resolver: zodResolver(updateCompanyFormSchema),
    defaultValues: UPDATE_COMPANY_DIALOG_DEFAULT_VALUES(updatingCompany),
  });

  const { mutateAsync: updateCompany } = useUpdateCompany();

  async function onSubmit(values: z.infer<typeof updateCompanyFormSchema>) {
    try {
      await updateCompany({ ...values, companyCode: updatingCompany.companyCode });
      setOpen(false);
    } catch (error) {
      console.error(['updateCompanyError'], error);
      errorToast({ message: 'Error updating company', title: 'Error' });
    }
  }

  return (
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
            type='button'
            variant={'outline'}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!form.formState.isValid}
            type='submit'
          >
            Update Company
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
