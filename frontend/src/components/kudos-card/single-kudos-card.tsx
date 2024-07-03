import { formatDate, getUserDisplayName } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import KudoLikeButton from './kudo-like-button';
import CommentSectionComponent from './comment-section';
import { Comment, TKudos } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import KudoCardDropDownMenu from './kudo-card-dropdown-menu';

export default function SingleKudosCard({ kudo }: { kudo: TKudos }) {
  const { user } = useAuth().state;
  console.log(user?.userId);
  const { sender, receiver } = kudo;
  const isLiked = kudo.userLikes.some((userLike) => userLike.userId === user?.userId);
  const senderDisplayName = getUserDisplayName(sender);
  const receiverDisplayName = getUserDisplayName(receiver);
  const usersKudo = kudo.sender.userId === user?.userId;
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
            >
              Reply
            </Button>
            <div className='flex items-center gap-1'>
              <KudoLikeButton
                isLiked={isLiked}
                kudoId={kudo.id}
                userId={user?.userId as string}
                companyId={user?.companyId as string}
              />

              <p className='text-sm text-gray-500'>{kudo.likes}</p>
            </div>
          </div>
        </div>
        {usersKudo && <KudoCardDropDownMenu kudo={kudo} />}
      </div>
      <CommentSectionComponent comments={kudo.comments as Comment[]} />
    </div>
  );
}
