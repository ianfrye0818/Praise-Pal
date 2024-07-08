import KudosTable from '@/components/admin/tables/kudos-table';
import { QueryKeys } from '@/constants';
import useGetCompanyKudos from '@/hooks/api/useKudos/useGetCompanyKudos';
import { useAuth } from '@/hooks/useAuth';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_rootLayout/_adminLayout/admin/kudos')({
  component: () => <KudosAdminPage />,
});

function KudosAdminPage() {
  const { user } = useAuth().state;
  const { data: kudos } = useGetCompanyKudos(
    {
      companyId: user?.companyId as string,
    },
    QueryKeys.allKudos
  );

  if (!kudos || kudos.length === 0) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <p>Your company has no Kudos!</p>
      </div>
    );
  }

  return (
    <div className='w-full py-5 p-1 md:p-4 h-full'>
      <div className='flex items-center'>
        <h2 className='font-semibold text-lg md:text-2xl my-4'>Kudos</h2>
      </div>
      <KudosTable kudos={kudos} />
    </div>
  );
}
