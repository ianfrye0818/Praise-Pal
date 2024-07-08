import SingleKudosPage from '@/components/comments/singleKudosPage';
import { QueryKeys } from '@/constants';
import useGetCompanyKudos from '@/hooks/api/useKudos/useGetCompanyKudos';
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

  const { data: kudos } = useGetCompanyKudos(
    {
      companyId: currentUser?.companyId as string,
      id: kudosId,
    },
    QueryKeys.singleKudo(kudosId)
  );

  if (!kudos || kudos.length === 0) return <div>No Kudo Found</div>;

  return (
    <div>
      <KudoContext.Provider value={kudos[0]}>
        <SingleKudosPage />
      </KudoContext.Provider>
    </div>
  );
}
