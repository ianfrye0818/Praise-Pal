import { HeartIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useLikeComment from '@/hooks/api/useComments.tsx/useLikeComment';
import { QueryKey } from '@tanstack/react-query';
import { CommentLike } from '@/types';

interface Props {
  isLiked: boolean;
  commentId: string;
  userId: string;
  kudoQueryKey?: QueryKey;
  commentQueryKey?: QueryKey;
  commentLikes: CommentLike[];
}

export default function CommentLikeButton({
  isLiked,
  commentId,
  kudoQueryKey,
  commentQueryKey,
  commentLikes,
  userId,
}: Props) {
  const { mutateAsync: toggleLikeComment } = useLikeComment({
    kudoQueryKey,
    commentQueryKey,
  });
  const handleToggleCommentLike = async () => {
    await toggleLikeComment({ commentId, isLiked, commentLikes, userId });
  };
  return (
    <Button
      size='sm'
      className='bg-transparent hover:bg-transparent'
      onClick={handleToggleCommentLike}
    >
      <HeartIcon
        fill={isLiked ? 'red' : 'none'}
        className={cn('w-4 h-4', isLiked ? 'text-red-500' : 'text-gray-400')}
      />

      <span className='sr-only'>Like</span>
    </Button>
  );
}
