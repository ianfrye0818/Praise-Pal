import { isCustomError } from '@/errors';

export default function CustomErrorComponent({ error }: { error: Error }) {
  if (isCustomError(error)) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <p>{error.message}</p>
      </div>
    );
  } else {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <p>Oops! Something went wrong while fetching data...</p>
        <p>Please try again later</p>
      </div>
    );
  }
}
