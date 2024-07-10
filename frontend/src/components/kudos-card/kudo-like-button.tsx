import { HeartIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useLikeKudos from '@/hooks/api/useKudos/useLikeKudos';
import { QueryKey } from '@tanstack/react-query';

interface KudoLikeButtonProps {
  isLiked: boolean;
  kudoId: string;
  userId: string;
  companyId: string;
  queryKey?: QueryKey;
  userLikes: any;
}

export default function KudoLikeButton({
  isLiked,
  kudoId,
  queryKey,
  userLikes,
  userId,
}: KudoLikeButtonProps) {
  const { mutateAsync: toggleKudo } = useLikeKudos(queryKey);

  async function handleToggleKudo() {
    await toggleKudo({
      isLiked,
      kudoId,
      userId,
      userLikes,
    });
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='text-gray-400 hover:text-gray-900 dark:hover:text-gray-50'
      onClick={handleToggleKudo}
    >
      <HeartIcon
        fill={isLiked ? 'red' : 'none'}
        className={cn('w-4 h-4', isLiked ? 'text-red-500' : 'text-gray-400')}
      />

      <span className='sr-only'>Like</span>
    </Button>
  );
}
