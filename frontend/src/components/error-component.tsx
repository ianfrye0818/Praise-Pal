import { useEffect } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useRouter, useNavigate } from '@tanstack/react-router';

const ErrorComponent = () => {
  const router = useRouter();
  const queryErrorResetBoundry = useQueryErrorResetBoundary();
  const navigate = useNavigate();

  useEffect(() => {
    queryErrorResetBoundry.reset();
  }, [queryErrorResetBoundry]);

  return (
    <div className='flex flex-col items-center justify-center h-screen p-4 text-center'>
      <h2 className='text-4xl font-semibold text-slate-800'>Oops! We've hit a snag</h2>
      <p className='mt-4 text-lg text-slate-800'>
        It seems that the data you're looking for is missing or could not be retrieved at this time.
      </p>
      <div className='mt-6'>
        <button
          className='px-4 py-2 mr-4 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700'
          onClick={() => navigate({ to: '/' })}
        >
          Go to Homepage
        </button>
        <button
          className='px-4 py-2 font-semibold text-white bg-gray-600 rounded hover:bg-gray-700'
          onClick={() => router.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;
