import KudosCard from '@/components/kudos-card/kudos-card';
import { createFileRoute } from '@tanstack/react-router';

import useGetCompanyKudos from '@/hooks/api/useKudos/useGetCompanyKudos';
import { useAuth } from '@/hooks/useAuth';
import AddKudosDialog from '@/components/dialogs/add-kudos-dialog';

export const Route = createFileRoute('/_rootLayout/')({
  component: () => <HomePage />,
});

function HomePage() {
  const { user } = useAuth().state;
  const { data: kudos } = useGetCompanyKudos({
    companyId: user?.companyId as string,
    isHidden: false,
  });

  if (!kudos || kudos.length === 0) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <p>Your company has no Kudos!</p>
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

export default Route;
