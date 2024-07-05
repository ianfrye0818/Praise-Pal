import SingleKudosPage from '@/components/comments/singleKudosPage';
import { CustomError } from '@/errors';
import useGetSingleKudo from '@/hooks/api/useKudos/useGetSingleKudo';
import { useAuth } from '@/hooks/useAuth';
import { TKudos } from '@/types';
import { createLazyFileRoute } from '@tanstack/react-router';
import { createContext, useContext } from 'react';

const KudoContext = createContext<TKudos | null>(null);

export const Route = createLazyFileRoute('/_rootLayout/kudos/$kudosId')({
  component: () => <Component />,
});

function Component() {
  const { kudosId } = Route.useParams();
  const { user: currentUser } = useAuth().state;

  const {
    data: kudo,
    error,
    isLoading,
  } = useGetSingleKudo({
    kudoId: kudosId,
    companyId: currentUser?.companyId as string,
  });

  //TODO: replace with loading and error componetns
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!kudo) return <div>Not Found</div>;

  return (
    <div>
      <KudoContext.Provider value={kudo}>
        <SingleKudosPage />
      </KudoContext.Provider>
    </div>
  );
}

export const useKudoContext = () => {
  const context = useContext(KudoContext);
  if (!context)
    throw new CustomError('useKudoContext must be used within a KudoContext.Provider', 400);
  return context;
};
