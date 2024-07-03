import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

interface CommentInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function CommentInputComponent({ ...props }: CommentInputProps) {
  return (
    <div className='flex w-full items-center space-x-2 mt-4'>
      <div className='relative w-full'>
        <Input
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
}
