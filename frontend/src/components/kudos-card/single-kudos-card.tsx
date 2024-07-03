import { formatDate, getUserDisplayName } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import KudoLikeButton from './kudo-like-button';
import CommentSectionComponent from './comment-section';
import { Comment, TKudos } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import KudoCardDropDownMenu from './kudo-card-dropdown-menu';
import CommentInputComponent from './comment-input';
import useCreateComment from '@/hooks/api/useComments.tsx/useCreateComment';
import { useRef, useState } from 'react';

export default function SingleKudosCard({ kudo }: { kudo: TKudos }) {
  const { user: currentUser } = useAuth().state;
  const { mutateAsync: createComment } = useCreateComment(currentUser?.companyId as string);
  const [newComment, setNewComment] = useState('');
  const { sender, receiver } = kudo;
  const isLiked = kudo.userLikes.some((userLike) => userLike.userId === currentUser?.userId);
  const senderDisplayName = getUserDisplayName(sender);
  const receiverDisplayName = getUserDisplayName(receiver);
  const usersKudo = kudo.sender.userId === currentUser?.userId;
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleRefFocus = () => {
    commentInputRef.current?.focus();
  };

  return (
    <div className='bg-background text-foreground rounded-lg md:shadow-md p-6 space-y-6 container mx-auto md:mt-12'>
      <div className='flex items-start space-x-4'>
        <Avatar>
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
              onClick={handleRefFocus}
            >
              Reply
            </Button>
            <div className='flex items-center gap-1'>
              <KudoLikeButton
                isLiked={isLiked}
                kudoId={kudo.id}
                userId={currentUser?.userId as string}
                companyId={currentUser?.companyId as string}
              />

              <p className='text-sm text-gray-500'>{kudo.likes}</p>
            </div>
          </div>
        </div>
        {usersKudo && <KudoCardDropDownMenu kudo={kudo} />}
      </div>
      <CommentSectionComponent comments={kudo.comments as Comment[]} />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createComment({
            content: newComment,
            kudosId: kudo.id,
            userId: currentUser?.userId as string,
          });
          setNewComment('');
        }}
      >
        <CommentInputComponent
          ref={commentInputRef}
          placeholder='Add a comment to this kudo'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      </form>
    </div>
  );
}
