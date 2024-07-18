import { HeartIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useLikeKudos from '@/hooks/api/useKudos/useLikeKudos';
import { QueryKey } from '@tanstack/react-query';

interface KudoLikeButtonProps {
  isLiked: boolean;
  kudoId: string;
  userId: string;
  companyCode: string;
  queryKey?: QueryKey;
  kudoLikes: any;
}

export default function KudoLikeButton({
  isLiked,
  kudoId,
  queryKey,
  kudoLikes,
  userId,
}: KudoLikeButtonProps) {
  const { mutateAsync: toggleKudo } = useLikeKudos(queryKey);

  async function handleToggleKudo() {
    await toggleKudo({
      isLiked,
      kudoId,
      userId,
      kudoLikes,
    });
  }

  return (
    <Button
      size={'sm'}
      variant={'ghost'}
      className='hover:bg-transparent  text-gray-400  p-1 rounded-full'
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
