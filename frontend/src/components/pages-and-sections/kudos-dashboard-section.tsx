import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button';
import KudosTable from '../tables/kudos-table';
import { TKudos } from '@/types';

export default function KudosDashboardSection({ kudos }: { kudos: TKudos[] }) {
  return (
    <section className='w-full'>
      <div className='flex items-center'>
        <h2 className='font-semibold text-lg md:text-2xl my-4'>Kudos</h2>
        <Button
          className='ml-auto'
          asChild
        >
          <Link to={'/admin/kudos'}>View All</Link>
        </Button>
      </div>

      <KudosTable
        kudos={kudos}
        showKudosNumber={false}
      />
    </section>
  );
}
