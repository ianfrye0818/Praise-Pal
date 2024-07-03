import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useGetSingleKudo from '@/hooks/api/useKudos/useGetSingleKudo';
import { useAuth } from '@/hooks/useAuth';
import { cn, formatDate, getUserDisplayName } from '@/lib/utils';
import { Comment, TKudos } from '@/types';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Send, HeartIcon } from 'lucide-react';
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
  console.log(kudo);
  return (
    <div>
      <SingleKudosCard kudo={kudo} />
    </div>
  );
}

function SingleKudosCard({ kudo }: { kudo: TKudos }) {
  const { user } = useAuth().state;
  const receiverDisplayName = getUserDisplayName(kudo.receiver);
  const senderDisplayName = getUserDisplayName(kudo.sender);
  const isLiked = kudo.userLikes.some((userLike) => userLike.userId === kudo.senderId);
  const usersKudo = kudo.senderId === user?.userId;
  return (
    <div className='bg-background text-foreground rounded-lg md:shadow-md p-6 space-y-6 container mx-auto md:mt-12'>
      <div className='flex items-start space-x-4'>
        <Avatar>
          <AvatarImage src='/placeholder-user.jpg' />
          <AvatarFallback>{senderDisplayName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='flex-1 space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>{receiverDisplayName}</div>
            <div className='text-xs text-muted-foreground'>{formatDate(kudo.createdAt)}</div>
          </div>
          <div className='text-lg font-semibold'>{kudo.title}</div>
          <p>{kudo.message}</p>
          <div className='flex items-center space-x-2'>
            <Button
              variant='link'
              size='sm'
            >
              Reply
            </Button>
            <Button
              variant='link'
              size='sm'
            >
              <HeartIcon className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>
      <CommentsSection comments={kudo.comments} />
    </div>
  );
}

export const CommentComponent = ({ content, user, createdAt, comments }: Comment) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const [newReply, setNewReply] = useState('');
  // const [replyList, setReplyList] = useState(replies);

  // const handleAddReply = () => {
  //   const newReplyObj: Comment = {
  //     id: replyList.length.toString(),
  //     author: 'Current User', // Replace with actual current user
  //     date: new Date().toLocaleDateString(),
  //     content: newReply,
  //     isLiked: false,
  //     replies: [],
  //   };
  //   setReplyList([...replyList, newReplyObj]);
  //   setNewReply('');
  //   setReplyVisible(false);
  // };
  const senderDisplayName = getUserDisplayName(user);

  return (
    <div className='flex items-start space-x-4'>
      <Avatar className='w-8 h-8'>
        <AvatarFallback>{senderDisplayName[0]}</AvatarFallback>
      </Avatar>
      <div className='flex-1 space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='font-medium'>{senderDisplayName}</div>
          <div className='text-xs text-muted-foreground'>{formatDate(createdAt)}</div>
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
            {/* TODO: Implement comment liking */}
            {/* <HeartIcon
              className={cn('w-4 h-4', { 'text-red-500': isLiked })}
              fill={isLiked ? 'red' : 'none'}
            /> */}
          </Button>
          <div className='text-xs text-muted-foreground'>{comments?.length || 0} replies</div>
        </div>
        {replyVisible && (
          <CommentInput
            onChange={(e) => setNewReply(e.target.value)}
            value={newReply}
            placeholder='Add a comment...'
            // onClick={handleAddReply}
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
        {comments && comments?.length > 0 && (
          <div className='pl-6'>
            {comments.map((reply, index) => (
              <CommentComponent
                key={index}
                {...reply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentsSection = ({ comments }: { comments: Comment[] }) => {
  return (
    <div className='space-y-4'>
      <div className='font-medium'>Comments</div>
      <div className='space-y-4'>
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            {...comment}
          />
        ))}
      </div>
      <CommentInput placeholder='Add a comment to this kudo' />
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
