import KudosCard from '@/components/kudos-card/kudos-card';
import { createFileRoute } from '@tanstack/react-router';

import useGetCompanyKudos from '@/hooks/api/useKudos/useGetCompanyKudos';
import { useAuth } from '@/hooks/useAuth';

export const Route = createFileRoute('/_rootLayout/')({
  component: () => <HomePage />,
});

function HomePage() {
  const { user } = useAuth().state;
  const {
    data: kudos,
    error,
    isLoading,
  } = useGetCompanyKudos({ companyId: user?.companyId as string, isHidden: false });

  // TODO: replace with loading and error componetns
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  //TODO: replace with no kudos component
  if (!kudos || !kudos.length) return <div>No Kudos</div>;

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
