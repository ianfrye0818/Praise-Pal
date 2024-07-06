import SingleKudosPage from '@/components/comments/singleKudosPage';
import useGetSingleKudo from '@/hooks/api/useKudos/useGetSingleKudo';
import { useAuth } from '@/hooks/useAuth';
import { TKudos } from '@/types';
import { createLazyFileRoute } from '@tanstack/react-router';
import { createContext } from 'react';

export const KudoContext = createContext<TKudos | null>(null);

export const Route = createLazyFileRoute('/_rootLayout/kudos/$kudosId')({
  component: () => <Component />,
});

function Component() {
  const { kudosId } = Route.useParams();
  const { user: currentUser } = useAuth().state;

  const { data: kudo } = useGetSingleKudo({
    kudoId: kudosId,
    companyId: currentUser?.companyId as string,
  });

  //TODO: no kudo component
  if (!kudo) return <div>No Kudo Found</div>;
  return (
    <div>
      <KudoContext.Provider value={kudo}>
        <SingleKudosPage />
      </KudoContext.Provider>
    </div>
  );
}
