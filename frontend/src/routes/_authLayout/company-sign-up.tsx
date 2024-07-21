import CompanySignUpForm from '@/components/forms/company-sign-up-form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authLayout/company-sign-up')({
  component: CompanySignUpPage,
});

function CompanySignUpPage() {
  return (
    <div className='min-h-[calc(100dvh-96px)] w-full flex flex-col justify-center items-center px-5 pb-8'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl font-bold'>Register Your Company</h1>
        <h2>Fill out the form below and we will be in contact to get you started sharing kudos!</h2>
        <CompanySignUpForm />
      </div>
    </div>
  );
}
