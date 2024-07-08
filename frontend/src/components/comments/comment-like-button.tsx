import { HeartIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useLikeComment from '@/hooks/api/useComments.tsx/useLikeComment';
import { QueryKey } from '@tanstack/react-query';

interface Props {
  isLiked: boolean;
  commentId: string;
  userId: string;
  kudoQueryKey?: QueryKey;
  commentQueryKey?: QueryKey;
}

export default function CommentLikeButton({
  isLiked,
  commentId,
  kudoQueryKey,
  commentQueryKey,
}: Props) {
  const { mutateAsync: toggleLikeComment } = useLikeComment({
    kudoQueryKey,
    queryKey: commentQueryKey,
  });
  const handleToggleCommentLike = async () => {
    await toggleLikeComment({ commentId, isLiked });
  };
  return (
    <Button
      variant='ghost'
      size='icon'
      className='text-gray-400 hover:text-gray-900 dark:hover:text-gray-50'
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
