import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { COMPANY_SIGN_UP_FORM_DEFAULT_VALUES } from '@/constants';
import { SubmitCompanyContactSchema } from '@/zodSchemas';
import { CompanySignUpFormProps } from '@/types';
import { Separator } from '../ui/separator';
import { getFormattedPhoneNumber } from '@/lib/utils';
import { isCustomError } from '@/errors';
import useSuccessToast from '@/hooks/useSuccessToast';
import useRequestNewCompany from '@/hooks/api/useCompany/useRequestNewCompany';
import CompanyInfoForm from './company-sign-up-form_company-info';
import CompanyContactInfoForm from './company-sign-up-form_company-contact-info';

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
        <CompanyContactInfoForm
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
