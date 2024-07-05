import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { MailIcon, PhoneIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Company, User } from '@/types';
import UpdateCompanyDialog from '../dialogs/update-company-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function CompanyCard({ company }: { company: Company }) {
  const { user: currentUser } = useAuth().state;
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex justify-between items-center'>
            <div className='flex flex-col gap-3'>
              <h1>Company</h1> {error && <p className='italic text-red-500 text-[16px]'>{error}</p>}
            </div>
            <UpdateCompanyDialog
              updatingCompany={company}
              currentUser={currentUser as User}
              error={error}
              setError={setError}
            >
              <Button
                onClick={() => setError(null)}
                variant={'secondary'}
              >
                Edit
              </Button>
            </UpdateCompanyDialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='flex items-center gap-4'>
              <div>
                <h3 className='font-semibold'>{company.name}</h3>
                <p className='text-muted-foreground'>Company code: {company.companyCode}</p>
              </div>
            </div>
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
