import SingleKudosCard from '@/components/kudos-card/single-kudos-card';
import useGetSingleKudo from '@/hooks/api/useKudos/useGetSingleKudo';
import { useAuth } from '@/hooks/useAuth';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_rootLayout/kudos/$kudosId')({
  component: () => <SingleKudosPage />,
});

function SingleKudosPage() {
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!kudo) return <div>Not Found</div>;
  console.log({ kudo });
  return (
    <div>
      <SingleKudosCard kudo={kudo} />
    </div>
  );
}
