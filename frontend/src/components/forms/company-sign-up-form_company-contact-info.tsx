import { CompanySignUpFormProps } from '@/types';
import { SubmitCompanyContactSchema } from '@/zodSchemas';
import { UseFormReturn } from 'react-hook-form';
import { FormInputItem } from './form-input-item';
import { CheckBoxInputItem } from './form-checkbox-input-item';
import FormSelectItem from './form-select-item';
import { getContactTimeOptions } from '@/lib/utils';

interface CompanyContactInfoFormProps {
  form: UseFormReturn<CompanySignUpFormProps>;
  sameNumber: boolean;
}

export default function CompanyContactInfoForm({ form, sameNumber }: CompanyContactInfoFormProps) {
  const contactTimeOptions = getContactTimeOptions();
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
