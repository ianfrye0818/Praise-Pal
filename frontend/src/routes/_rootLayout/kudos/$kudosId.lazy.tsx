import KudosCard from '@/components/kudos-card/kudos-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useGetSingleKudo from '@/hooks/api/useKudos/useGetSingleKudo';
import { useAuth } from '@/hooks/useAuth';
import { TKudos } from '@/types';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Send, ThumbsUpIcon } from 'lucide-react';
import { useState } from 'react';

export const Route = createLazyFileRoute('/_rootLayout/kudos/$kudosId')({
  component: () => <SingleKudosPage />,
});

function SingleKudosPage() {
  const { kudosId } = Route.useParams();
  const { user: currentUser } = useAuth().state;

  const {
    data: kudo,
    error,
    isLoading,
  } = useGetSingleKudo({
    kudoId: kudosId,
    companyId: currentUser?.companyId as string,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!kudo) return <div>Not Found</div>;
  return (
    <div>
      <SingleKudosCard kudo={kudo} />
    </div>
  );
}

function SingleKudosCard({ kudo }: { kudo: TKudos }) {
  return (
    // <div className='w-full max-w-2xl mx-auto space-y-6'>
    //   <div className='bg-background rounded-lg shadow-sm border'>
    //     <div className='flex items-center gap-4 p-4 border-b'>
    //       <Avatar className='w-10 h-10'>
    //         <AvatarImage src='/placeholder-user.jpg' />
    //         <AvatarFallback>JD</AvatarFallback>
    //       </Avatar>
    //       <div className='flex-1'>
    //         <div className='flex items-center gap-2'>
    //           <div className='font-medium'>Someone Special</div>
    //           <div className='text-xs text-muted-foreground'>sent a kudo to</div>
    //           <div className='font-medium'>John Doe</div>
    //         </div>
    //         <div className='text-xs text-muted-foreground'>2 days ago</div>
    //       </div>
    //     </div>
    //     <div className='p-4'>
    //       <p>
    //         You&apos;ve been doing an amazing job on the project! Your dedication and hard work have
    //         really made a difference.
    //       </p>
    //     </div>
    //   </div>
    <>
      {/* <KudosCard
        kudo={kudo}
        commenting
      /> */}
      <CommentsSection />
    </>
  );
}

export const Comment = ({
  author,
  date,
  content,
  replies,
}: {
  author: string;
  date: string;
  content: string;
  replies: { author: string; date: string; content: string; replies: any[] }[];
}) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [replyList, setReplyList] = useState(replies);

  const handleAddReply = () => {
    const newReplyObj = {
      author: 'Current User', // Replace with actual current user
      date: new Date().toLocaleDateString(),
      content: newReply,
      replies: [],
    };
    setReplyList([...replyList, newReplyObj]);
    setNewReply('');
    setReplyVisible(false);
  };

  return (
    <div className='flex items-start space-x-4'>
      <Avatar className='w-8 h-8'>
        <AvatarFallback>{author[0]}</AvatarFallback>
      </Avatar>
      <div className='flex-1 space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='font-medium'>{author}</div>
          <div className='text-xs text-muted-foreground'>{date}</div>
        </div>
        <p>{content}</p>
        <div className='flex items-center space-x-2'>
          <Button
            variant='link'
            size='sm'
            onClick={() => setReplyVisible(!replyVisible)}
          >
            Reply
          </Button>
          <Button
            variant='link'
            size='sm'
          >
            <ThumbsUpIcon className='w-4 h-4' />
          </Button>
          <div className='text-xs text-muted-foreground'>{replyList.length} replies</div>
        </div>
        {replyVisible && (
          <CommentInput
            onChange={(e) => setNewReply(e.target.value)}
            value={newReply}
            placeholder='Add a comment...'
            onClick={handleAddReply}
          />
          // <div className='mt-2'>
          //   <Input
          //     placeholder='Add a comment...'
          //     value={newReply}
          //     onChange={(e) => setNewReply(e.target.value)}
          //   />
          //   <Button onClick={handleAddReply}>Submit</Button>
          // </div>
        )}
        <div className='pl-6'>
          {replyList.map((reply, index) => (
            <Comment
              key={index}
              author={reply.author}
              date={reply.date}
              content={reply.content}
              replies={reply.replies}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const CommentsSection = () => {
  const initialComments = [
    {
      author: 'Jared Palmer',
      date: 'Oct 8, 2023',
      content:
        "Thanks, Olivia! I'm really glad you're happy with the work. It's been a pleasure working with you on this project.",
      replies: [
        {
          author: 'Olivia Davis',
          date: 'Oct 8, 2023',
          content:
            "I'm so glad you enjoyed working on this project with me. It's been a great experience.",
          replies: [],
        },
      ],
    },
    {
      author: 'Max Leiter',
      date: 'Oct 9, 2023',
      content:
        "This is great to see! Kudos to you both for the amazing work. I'm really impressed with the results.",
      replies: [],
    },
  ];
  return (
    <div className='bg-background text-foreground rounded-lg shadow-md p-6 space-y-6 container mx-auto'>
      <div className='flex items-start space-x-4'>
        <Avatar>
          <AvatarImage src='/placeholder-user.jpg' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='flex-1 space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Olivia Davis</div>
            <div className='text-xs text-muted-foreground'>Oct 8, 2023</div>
          </div>
          <div className='text-lg font-semibold'>Great work on the project!</div>
          <p>
            I just wanted to say that your work on the project has been outstanding. You've really
            gone above and beyond, and I appreciate all the effort you've put in.
          </p>
        </div>
      </div>
      <div className='space-y-4'>
        <div className='font-medium'>Comments</div>
        <div className='space-y-4'>
          {initialComments.map((comment, index) => (
            <Comment
              key={index}
              author={comment.author}
              date={comment.date}
              content={comment.content}
              replies={comment.replies}
            />
          ))}
        </div>
        <CommentInput />
      </div>
    </div>
  );
};

interface CommentInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClick?: () => void;
}

function CommentInput({ onClick, ...props }: CommentInputProps) {
  return (
    <div className='flex w-full items-center space-x-2 mt-4'>
      <div className='relative w-full'>
        <Input {...props} />
        <Button
          className='absolute right-0 top-0 z-2 hover:bg-transparent'
          variant={'ghost'}
          onClick={onClick}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
