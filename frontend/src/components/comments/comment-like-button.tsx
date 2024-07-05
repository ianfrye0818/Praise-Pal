import { HeartIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useLikeComment from '@/hooks/api/useComments.tsx/useLikeComment';

interface Props {
  isLiked: boolean;
  commentId: string;
  userId: string;
}

export default function CommentLikeButton({ isLiked, commentId }: Props) {
  const { mutateAsync: toggleLikeComment } = useLikeComment();
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
