import { createFileRoute } from '@tanstack/react-router';
import useGetCompanyKudos from '@/hooks/api/useKudos/useGetCompanyKudos';
import { useAuth } from '@/hooks/useAuth';
import { QueryKeys } from '@/constants';
import DataLoader from '@/components/ui/data-loader';
import AddKudosDialog from '@/components/dialogs-and-menus/add-kudos-dialog';
import { Button } from '@/components/ui/button';
import KudosCard from '@/components/cards/kudos-card';
import { isCustomError } from '@/errors';
import CustomErrorComponent from '@/components/custom-error';

export const Route = createFileRoute('/_rootLayout/')({
  component: () => <HomePage />,
});

function HomePage() {
  const { user } = useAuth().state;
  const {
    data: kudos,
    isLoading,
    error,
  } = useGetCompanyKudos(
    {
      companyCode: user?.companyCode as string,
      isHidden: false,
    },
    QueryKeys.allKudos
  );

  if (isLoading) {
    return <DataLoader />;
  }

  if (error) {
    <CustomErrorComponent error={error} />;
  }

  if (!kudos || kudos.length === 0) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <p>Your company has no Kudos!</p>
        <AddKudosDialog>
          <Button
            variant={'link'}
            asChild
          >
            <p>Click here to add some</p>
          </Button>
        </AddKudosDialog>
      </div>
    );
  }

  return (
    <div>
      {kudos.map((kudo) => (
        <KudosCard
          key={kudo.id}
          kudo={kudo}
        />
      ))}
    </div>
  );
}

export default Route;
