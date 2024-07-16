import { TKudos } from '@/types';
import { createContext } from 'react';
import { createLazyFileRoute, useRouter } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import useErrorToast from '@/hooks/useErrorToast';
import useGetSingleKudo from '@/hooks/api/useKudos/useGetSingleKudo';
import { QueryKeys } from '@/constants';
import DataLoader from '@/components/ui/data-loader';
import { Button } from '@/components/ui/button';
import SingleKudosPage from '@/components/pages-and-sections/singleKudosPage';

export const KudoContext = createContext<TKudos | null>(null);

export const Route = createLazyFileRoute('/_rootLayout/kudos/$kudosId')({
  component: Component,
});

function Component() {
  const { kudosId } = Route.useParams();
  const { user: currentUser } = useAuth().state;
  const router = useRouter();
  const { errorToast } = useErrorToast();
  const { data: kudo, isLoading } = useGetSingleKudo({
    companyCode: currentUser?.companyCode as string,
    kudoId: kudosId,
    queryKey: QueryKeys.singleKudo(kudosId),
  });

  console.log(kudo);

  if (isLoading) {
    return <DataLoader />;
  }

  if (!kudo) {
    return (
      <div className='w-full h-full flex flex-col justify-center items-center gap-8 max-w-[400px] mx-auto'>
        <h1 className='text-2xl font-bold'>This Kudo no longer exists</h1>

        <Button
          className='w-full'
          onClick={() => {
            router.navigate({ to: '/' });
          }}
        >
          Return Home
        </Button>
      </div>
    );
  }

  if (kudo.isHidden && kudo.sender.userId !== currentUser?.userId) {
    router.navigate({ to: '/' });
    errorToast({ message: 'This Kudo is hidden' });
  }

  return (
    <div>
      <KudoContext.Provider value={kudo}>
        <SingleKudosPage />
      </KudoContext.Provider>
    </div>
  );
}
