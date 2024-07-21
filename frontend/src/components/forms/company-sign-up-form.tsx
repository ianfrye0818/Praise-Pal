import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { COMPANY_SIGN_UP_FORM_DEFAULT_VALUES } from '@/constants';
import { SubmitCompanyContactSchema } from '@/zodSchemas';
import { CompanySignUpFormProps } from '@/types';
import { FormInputItem } from './form-input-item';
import { Separator } from '../ui/separator';
import { getContactTimeOptions, getFormattedPhoneNumber } from '@/lib/utils';
import FormSelectItem from './form-select-item';
import { CheckBoxInputItem } from './form-checkbox-input-item';
import { isCustomError } from '@/errors';
import useSuccessToast from '@/hooks/useSuccessToast';
import * as libPhoneNumber from 'libphonenumber-js';

import useRequestNewCompany from '@/hooks/api/useCompany/useRequestNewCompany';

const contactTimeOptions = getContactTimeOptions();

export default function CompanySignUpForm() {
  const form = useForm<CompanySignUpFormProps>({
    resolver: zodResolver(SubmitCompanyContactSchema),
    defaultValues: COMPANY_SIGN_UP_FORM_DEFAULT_VALUES,
  });

  const { successToast } = useSuccessToast();
  const { mutateAsync: requestNewCompany } = useRequestNewCompany();

  const isSubmitting = form.formState.isSubmitting;
  const globalError = form.formState.errors.root;

  const companyPhone = form.getValues('companyInfo.phone');
  const sameNumber = form.getValues('contactInfo.sameNumber');

  const onSubmit = async (data: CompanySignUpFormProps) => {
    if (sameNumber) {
      const { isValid, formattedNumber } = getFormattedPhoneNumber(companyPhone);
      if (!isValid) {
        form.setError('companyInfo.phone', {
          message: 'Please enter a valid phone number',
        });
        return;
      }
      data.contactInfo.phone = formattedNumber;
    }

    try {
      await requestNewCompany(data);
      successToast({
        message: 'Your request was submitted successfully. We will be in touch with you soon!',
        title: 'Request Submitted',
        duration: 10000,
      });
      form.reset();
    } catch (error) {
      form.setError('root', {
        message: isCustomError(error) ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-3'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h3 className='text-xl font-bold'>Company Info</h3>
        <CompanyInfoForm form={form} />
        <Separator className='my-3' />

        <h3 className='text-xl font-bold'>Contact Person</h3>
        <CompanyContactPersonForm
          form={form}
          sameNumber={form.getValues('contactInfo.sameNumber')}
        />

        {globalError && <p className='text-red-600 italic text-sm '>{globalError.message}</p>}
        <Button
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding....' : 'Add Company'}
        </Button>
      </form>
    </Form>
  );
}

function CompanyInfoForm({ form }: { form: UseFormReturn<CompanySignUpFormProps> }) {
  return (
    <section>
      <FormInputItem<typeof SubmitCompanyContactSchema>
        control={form.control}
        name='companyInfo.name'
        label='Company Name*'
        placeholder='Company Name'
      />

      <FormInputItem<typeof SubmitCompanyContactSchema>
        control={form.control}
        name='companyInfo.phone'
        label='Phone Number*'
        placeholder='Phone Number'
      />

      <FormInputItem<typeof SubmitCompanyContactSchema>
        control={form.control}
        name='companyInfo.address'
        label='Address'
        placeholder='Street Address'
      />
      <div className='flex gap-3'>
        <div className='flex-1'>
          <FormInputItem<typeof SubmitCompanyContactSchema>
            control={form.control}
            name='companyInfo.city'
            label='City'
            placeholder='City'
          />
        </div>
        <div className=' max-w-16'>
          <FormInputItem<typeof SubmitCompanyContactSchema>
            control={form.control}
            name='companyInfo.state'
            label='State'
            placeholder='State'
            maxLength={2}
          />
        </div>
        <div className=' max-w-24'>
          <FormInputItem<typeof SubmitCompanyContactSchema>
            control={form.control}
            name='companyInfo.zip'
            label='Zipcode'
            placeholder='Zip'
            maxLength={5}
          />
        </div>
      </div>
    </section>
  );
}

function CompanyContactPersonForm({
  form,
  sameNumber,
}: {
  form: UseFormReturn<CompanySignUpFormProps>;
  sameNumber: boolean;
}) {
  return (
    <>
      <div className='flex items-center gap-2 '>
        <div className='flex-1'>
          <FormInputItem<typeof SubmitCompanyContactSchema>
            control={form.control}
            name='contactInfo.firstName'
            label='First Name*'
            placeholder='First Name'
          />
        </div>
        <div className='flex-1'>
          <FormInputItem<typeof SubmitCompanyContactSchema>
            control={form.control}
            name='contactInfo.lastName'
            label='Last Name*'
            placeholder='Last Name'
          />
        </div>
      </div>
      <FormInputItem<typeof SubmitCompanyContactSchema>
        control={form.control}
        name='contactInfo.email'
        label='Email*'
        placeholder='Email'
      />
      {!sameNumber && (
        <FormInputItem<typeof SubmitCompanyContactSchema>
          control={form.control}
          name='contactInfo.phone'
          label='Phone Number*'
          placeholder='Phone Number'
        />
      )}

      <CheckBoxInputItem<typeof SubmitCompanyContactSchema>
        control={form.control}
        name='contactInfo.sameNumber'
        label='Phone number same as company phone number'
      />

      <FormSelectItem<typeof SubmitCompanyContactSchema>
        control={form.control}
        name='contactInfo.bestTimeToContact'
        options={contactTimeOptions}
        label='Best Time to Contact*'
        placeholder='Select Time'
      />
    </>
  );
}
