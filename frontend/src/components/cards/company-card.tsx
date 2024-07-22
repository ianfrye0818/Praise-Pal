import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailIcon, PhoneIcon } from 'lucide-react';
import { Button } from '../ui/button';
import FormDialog from '../dialogs-and-menus/form-dialog';
import { UpdateCompanyForm } from '../forms/update-company-form';
import { Company, Role } from '@/types';

export default function CompanyCard({ company }: { company: Company }) {
  const { user: currentUser } = useAuth().state;

  const canUpdateCompany = currentUser?.role === Role.COMPANY_OWNER;

  return (
    <>
      <Card className='w-full'>
        <CardHeader>
          <div className='flex flex-col md:flex-row  md:items-center md:justify-between gap-4'>
            <div className='space-y-4'>
              <CardTitle className='flex justify-between items-center'>{company.name}</CardTitle>
              <CardDescription>CompanyCode: {company.companyCode}</CardDescription>
            </div>
            {canUpdateCompany && (
              <div>
                <FormDialog
                  form={UpdateCompanyForm}
                  formProps={{ updatingCompany: company }}
                  title='Update Company'
                  description='Update company details'
                >
                  <Button variant={'secondary'}>Update</Button>
                </FormDialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='flex items-center gap-4'></div>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <PhoneIcon className='w-4 h-4 text-muted-foreground' />
                <span>{company.phone || ''}</span>
              </div>

              {/* <MailIcon className='w-4 h-4 text-muted-foreground' /> */}
              <div className='flex items-center gap-2'>
                <MailIcon className='w-4 h-4 text-muted-foreground' />
                <div className='flex flex-col'>
                  <div className='flex items-center gap-2'>
                    <span>{company.address || ''}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span>{company.city || ''}</span>
                    <span>{company.state || ''}</span>
                    <span>{company.zip || ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
