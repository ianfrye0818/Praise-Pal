import { TKudos } from '@/types';
import { createContext } from 'react';
import { createLazyFileRoute, Navigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import useErrorToast from '@/hooks/useErrorToast';
import useGetSingleKudo from '@/hooks/api/useKudos/useGetSingleKudo';
import { QueryKeys } from '@/constants';
import DataLoader from '@/components/ui/data-loader';
import SingleKudosPage from '@/components/pages-and-sections/singleKudosPage';

export const KudoContext = createContext<TKudos | null>(null);

export const Route = createLazyFileRoute('/_rootLayout/kudos/$kudosId')({
  component: Component,
});

function Component() {
  const { kudosId } = Route.useParams();
  const { user: currentUser } = useAuth().state;

  const { errorToast } = useErrorToast();
  const { data: kudo, isLoading } = useGetSingleKudo({
    companyCode: currentUser?.companyCode as string,
    kudoId: kudosId,
    queryKey: QueryKeys.singleKudo(kudosId),
  });

  if (isLoading) {
    return <DataLoader />;
  }

  if (!kudo || (kudo.isHidden && kudo.sender.userId !== currentUser?.userId)) {
    errorToast({ message: 'This Kudo is hidden' });
    return <Navigate to='/' />;
  }

  return (
    <div>
      <KudoContext.Provider value={kudo}>
        <SingleKudosPage />
      </KudoContext.Provider>
    </div>
  );
}
