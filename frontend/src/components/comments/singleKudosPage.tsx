import { getUserDisplayName, timeAgo } from '@/lib/utils';
import CommentSectionComponent from './comment-section';
import { Comment } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import KudoCardDropDownMenu from '../kudos-card/kudo-card-dropdown-menu';
import UserAvitar from '../UserAvitar';
import NewCommentForm from './new-comment-form';
import KudoLikeButton from '../kudos-card/kudo-like-button';
import { QueryKeys } from '@/constants';
import { useSingleKudoContext } from '@/hooks/useSingleKudoContext';

export default function SingleKudosPage() {
  const { user: currentUser } = useAuth().state;
  const kudo = useSingleKudoContext();

  const { sender, receiver } = kudo;
  const senderDisplayName = getUserDisplayName(sender);
  const receiverDisplayName = getUserDisplayName(receiver);
  const usersKudo = kudo.sender.userId === currentUser?.userId;
  const isLiked = kudo.kudoLikes
    ? kudo.kudoLikes.some((kudoLike) => kudoLike.userId === currentUser?.userId)
    : false;

  return (
    <div className='h-[calc(100dvh-48px)]  flex flex-col justify-between  text-foreground rounded-lg md:shadow-md p-6 space-y-6 container mx-auto md:mt-12 md:h-auto md:block overflow-x-auto'>
      <div>
        <div className='flex items-start space-x-4 mb-8'>
          <UserAvitar displayName={senderDisplayName} />
          <div className='flex-1 space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='font-medium'>{receiverDisplayName}</div>
              <div className='text-xs text-muted-foreground hidden md:block'>
                {timeAgo(kudo.createdAt)}
              </div>
            </div>
            <div className='text-lg font-semibold'>{kudo.title}</div>
            <p>{kudo.message}</p>
            <div className='flex items-center gap-2'>
              <KudoLikeButton
                isLiked={isLiked}
                kudoId={kudo?.id as string}
                userId={currentUser?.userId as string}
                companyCode={currentUser?.companyCode as string}
                queryKey={QueryKeys.singleKudo(kudo.id)}
                kudoLikes={kudo.kudoLikes}
              />
              <p className='text-sm text-gray-500'>{kudo.likes}</p>
            </div>
          </div>
          {usersKudo && (
            <KudoCardDropDownMenu
              kudo={kudo}
              querKey={QueryKeys.singleKudo(kudo.id)}
            />
          )}
        </div>
        <CommentSectionComponent comments={kudo.comments as Comment[]} />
      </div>
      <NewCommentForm type='parent' />
    </div>
  );
}
