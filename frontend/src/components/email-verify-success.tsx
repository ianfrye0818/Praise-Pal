import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Link } from '@tanstack/react-router';

export default function EmailVerifySuccess() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    setWindowSize({ width: windowWidth, height: windowHeight });
  }, []);

  return (
    <>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
      />
      <div className='flex flex-col gap-3 items-center'>
        <h1 className='text-2xl font-bold'>Your email has been verified!</h1>
        <Link
          className='text-xl text-blue-400'
          to='/sign-in'
        >
          Click here to sign in
        </Link>
      </div>
    </>
  );
}
