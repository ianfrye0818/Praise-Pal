import React from 'react';

export default function Placeholder() {
  return (
    <div className='bg-background rounded-lg shadow-sm border'>
      <div className='p-4 border-b'>
        <h3 className='text-lg font-medium'>Comments</h3>
      </div>
      <div className='space-y-4 p-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-4'>
            <Avatar className='w-8 h-8'>
              <AvatarImage src='/placeholder-user.jpg' />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <div className='font-medium'>Jane Doe</div>
                <div className='text-xs text-muted-foreground'>2 days ago</div>
              </div>
              <p>Great job, John! You deserve this kudo.</p>
            </div>
          </div>
          <div className='flex items-center gap-4 ml-12'>
            <Avatar className='w-8 h-8'>
              <AvatarImage src='/placeholder-user.jpg' />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <div className='font-medium'>John Doe</div>
                <div className='text-xs text-muted-foreground'>1 day ago</div>
              </div>
              <p>Thank you, Jane! I really appreciate the kind words.</p>
            </div>
          </div>
        </div>
        <div className='space-y-2'>
          <div className='flex items-center gap-4'>
            <Avatar className='w-8 h-8'>
              <AvatarImage src='/placeholder-user.jpg' />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <div className='font-medium'>Alex Johnson</div>
                <div className='text-xs text-muted-foreground'>3 days ago</div>
              </div>
              <p>Congrats, John! You deserve it.</p>
            </div>
          </div>
        </div>
        <div className='space-y-2'>
          <div className='flex items-center gap-4'>
            <Avatar className='w-8 h-8'>
              <AvatarImage src='/placeholder-user.jpg' />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <div className='font-medium'>Emily Davis</div>
                <div className='text-xs text-muted-foreground'>1 week ago</div>
              </div>
              <p>This is so nice! I&apos;m glad to see you being recognized for your hard work.</p>
            </div>
          </div>
        </div>
      </div>
      <div className='p-4 border-t'>
        <form className='flex items-center gap-2'>
          <Textarea
            placeholder='Write a comment...'
            className='flex-1 p-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
          <Button type='submit'>Submit</Button>
        </form>
      </div>
    </div>
  );
}
