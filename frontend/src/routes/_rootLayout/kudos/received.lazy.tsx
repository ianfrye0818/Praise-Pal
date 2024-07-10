import { createLazyFileRoute } from '@tanstack/react-router';
import KudosCard from '@/components/kudos-card/kudos-card';
import useGetCompanyKudos from '@/hooks/api/useKudos/useGetCompanyKudos';
import { useAuth } from '@/hooks/useAuth';
import { QueryKeys } from '@/constants';
import DataLoader from '@/components/data-loader';

export const Route = createLazyFileRoute('/_rootLayout/kudos/received')({
  component: () => <ReceivedPage />,
});

function ReceivedPage() {
  const { user } = useAuth().state;
  const { data: kudos, isLoading } = useGetCompanyKudos(
    {
      companyId: user?.companyId as string,
      receiverId: user?.userId as string,
      isHidden: false,
    },
    QueryKeys.receivedKudos
  );

  if (isLoading) {
    return <DataLoader />;
  }

  if (!kudos || kudos.length === 0) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <p>You have no received Kudos!</p>
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
