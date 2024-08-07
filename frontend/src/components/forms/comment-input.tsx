import React, { forwardRef } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

const CommentInputComponent = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <div className='flex w-full max-w-[300px] items-center space-x-2 mt-4'>
      <div className='relative w-full'>
        <Input
          ref={ref}
          minLength={2}
          {...props}
        />
        <Button
          className='absolute right-0 top-0 z-2 hover:bg-transparent'
          variant={'ghost'}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
});

export default CommentInputComponent;
