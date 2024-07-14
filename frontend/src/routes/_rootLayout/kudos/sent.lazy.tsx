import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import useGetCompanyKudos from '@/hooks/api/useKudos/useGetCompanyKudos';
import AddKudosDialog from '@/components/dialogs-and-menus/add-kudos-dialog';
import { QueryKeys } from '@/constants';
import DataLoader from '@/components/ui/data-loader';
import KudosCard from '@/components/cards/kudos-card';

export const Route = createLazyFileRoute('/_rootLayout/kudos/sent')({
  component: () => <SentPage />,
});

function SentPage() {
  const { user } = useAuth().state;
  const { data: kudos, isLoading } = useGetCompanyKudos(
    {
      companyCode: user?.companyCode as string,
      senderId: user?.userId as string,
    },
    QueryKeys.sentKudos
  );

  if (isLoading) {
    return <DataLoader />;
  }

  if (!kudos || kudos.length === 0) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <p>You have no sent Kudos!</p>
        <AddKudosDialog>
          <p className='text-blue-500'>Click here to add some</p>
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
