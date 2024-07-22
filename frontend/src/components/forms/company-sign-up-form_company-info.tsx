import { SubmitCompanyContactSchema } from '@/zodSchemas';
import { FormInputItem } from './form-input-item';
import { UseFormReturn } from 'react-hook-form';
import { CompanySignUpFormProps } from '@/types';

interface CompanyContactInfoProps {
  form: UseFormReturn<CompanySignUpFormProps>;
}

export default function CompanyInfoForm({ form }: CompanyContactInfoProps) {
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
