import { getUserDisplayName, timeAgo } from '@/lib/utils';
import CommentSectionComponent from './comment-section';
import { Comment } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import KudoCardDropDownMenu from '../kudos-card/kudo-card-dropdown-menu';
import { useKudoContext } from '@/routes/_rootLayout/kudos/$kudosId.lazy';
import UserAvitar from '../UserAvitar';
import LikeReplyButtons from './like-reply-buttons';
import NewCommentForm from './new-comment-form';

export default function SingleKudosPage() {
  const kudo = useKudoContext();
  const { user: currentUser } = useAuth().state;
  const { sender, receiver } = kudo;
  const senderDisplayName = getUserDisplayName(sender);
  const receiverDisplayName = getUserDisplayName(receiver);
  const usersKudo = kudo.sender.userId === currentUser?.userId;

  return (
    <div className='bg-background text-foreground rounded-lg md:shadow-md p-6 space-y-6 container mx-auto md:mt-12'>
      <div className='flex items-start space-x-4'>
        <UserAvitar displayName={senderDisplayName} />
        <div className='flex-1 space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>{receiverDisplayName}</div>
            <div className='text-xs text-muted-foreground'>{timeAgo(kudo.createdAt)}</div>
          </div>
          <div className='text-lg font-semibold'>{kudo.title}</div>
          <p>{kudo.message}</p>
          <LikeReplyButtons
            type='kudo'
            kudo={kudo}
          />
        </div>
        {usersKudo && <KudoCardDropDownMenu kudo={kudo} />}
      </div>
      <CommentSectionComponent comments={kudo.comments as Comment[]} />
      <NewCommentForm type='parent' />
    </div>
  );
}
