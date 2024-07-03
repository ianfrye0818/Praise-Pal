import { useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Comment } from '@/types';
import { formatDate, getUserDisplayName } from '@/lib/utils';
import CommentInput from './comment-input';
import CommentLikeButton from './comment-like-button';
import { useAuth } from '@/hooks/useAuth';
import useCreateComment from '@/hooks/api/useComments.tsx/useCreateComment';
import { MenuIcon } from 'lucide-react';
import { DropdownMenuContent, DropdownMenuTrigger, DropdownMenu } from '../ui/dropdown-menu';
import useDeleteCompanyUser from '@/hooks/api/useCompayUsers/useDeleteCompanyUser';
import UseDeleteComment from '@/hooks/api/useComments.tsx/useDeleteComment';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';

export default function CommentComponent(comment: Comment) {
  const { user: currentUser } = useAuth().state;
  const [replyVisible, setReplyVisible] = useState(false);
  const [newReply, setNewReply] = useState('');
  const { mutateAsync: createComment } = useCreateComment(currentUser?.companyId as string);
  const { mutateAsync: deleteComment } = UseDeleteComment(currentUser?.companyId as string);
  const senderDisplayName = getUserDisplayName(comment.user);
  const isLiked = true;

  return (
    <div className='flex items-start space-x-4'>
      <Avatar className='w-8 h-8'>
        <AvatarFallback>{senderDisplayName[0]}</AvatarFallback>
      </Avatar>
      <div className='flex-1 space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='font-medium'>{senderDisplayName}</div>
          <div className='text-xs text-muted-foreground'>{formatDate(comment.createdAt)}</div>
        </div>
        <div className='flex gap-4'>
          <p>{comment.content}</p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MenuIcon
                className='cursor-pointer'
                size={16}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button variant={'link'}>Edit</Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant={'link'}
                  onClick={() =>
                    deleteComment({ commentId: comment.id, parentId: comment.parentId })
                  }
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='flex items-center'>
          <Button
            variant='link'
            size='sm'
            onClick={() => setReplyVisible(!replyVisible)}
          >
            Reply
          </Button>

          <CommentLikeButton
            commentId={comment.id}
            isLiked={isLiked}
            userId={comment.user.userId}
          />

          <div className='text-xs text-muted-foreground'>{comment.likes}</div>
        </div>
        {replyVisible && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await createComment({
                content: newReply,
                parentId: comment.id,
                userId: currentUser?.userId as string,
                kudosId: comment.kudosId,
              });
              setNewReply('');
              setReplyVisible(false);
            }}
          >
            <CommentInput
              onChange={(e) => setNewReply(e.target.value)}
              value={newReply}
              placeholder='Add a comment...'
            />
          </form>
        )}
        {comment && comment.comments && comment.comments.length > 0 && (
          <div>
            {comment.comments.map((reply) => (
              <CommentComponent
                {...reply}
                key={reply.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
