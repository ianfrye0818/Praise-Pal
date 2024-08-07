import { useEffect } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Button } from '../ui/button';

export default function ErrorComponent() {
  const router = useRouter();
  const queryErrorResetBoundry = useQueryErrorResetBoundary();

  useEffect(() => {
    queryErrorResetBoundry.reset();
  }, [queryErrorResetBoundry]);

  return (
    <div className='flex flex-col items-center justify-center h-dvh p-4 text-center'>
      <h2 className='text-4xl font-semibold text-slate-800'>Oops! We've hit a snag</h2>
      <p className='mt-4 text-lg text-slate-800'>
        It seems that the data you're looking for is missing or could not be retrieved at this time.
        Refresh the page or try again later.
      </p>
      <div className='mt-6 flex gap-4 items-center'>
        <Button
          variant={'secondary'}
          onClick={() => router.history.back()}
        >
          Go Back
        </Button>
        <Button onClick={() => router.navigate({ to: '/' })}>Go to Homepage</Button>
        <Button
          variant={'outline'}
          onClick={() => location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
