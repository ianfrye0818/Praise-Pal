import { Button } from '@/components/ui/button';
import { useRouter } from '@tanstack/react-router';

export default function NotFoundComponent() {
  const router = useRouter();
  return (
    <div className='flex flex-col h-[calc(100dvh-96px)] justify-center items-center text-center'>
      <div className='space-y-8 '>
        <h1 className='text-4xl font-bold tracking-tighter sm:text-6xl'>
          404 Error - Page Not Found
        </h1>
        <p className='max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed dark:text-gray-400'>
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
      </div>

      <Button
        className='mt-8'
        variant={'outline'}
        onClick={() => router.history.back()}
      >
        Go Back
      </Button>
    </div>
  );
}
