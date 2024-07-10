import { useAuth } from '@/hooks/useAuth';
import { Comment, CommentLike, UserLike } from '@/types';
import { Button } from '../ui/button';
import KudoLikeButton from '../kudos-card/kudo-like-button';
import CommentLikeButton from './comment-like-button';
import { QueryKeys } from '@/constants';
import { useSingleKudoContext } from '@/hooks/useSingleKudoContext';

export default function LikeReplyButtons({
  replyButtonAction,
  type,
  comment,
}: {
  replyButtonAction?: () => void;
  type: 'comment' | 'kudo';
  comment?: Comment;
}) {
  const { user: currentUser } = useAuth().state;
  const kudo = useSingleKudoContext();

  function isLiked() {
    if (type === 'kudo' && kudo && Array.isArray(kudo.userLikes) && currentUser) {
      return kudo.userLikes.some((userLike) => userLike.userId === currentUser.userId);
    }
    if (type === 'comment' && comment && Array.isArray(comment.commentLikes) && currentUser) {
      return comment.commentLikes.some((commentLike) => commentLike.userId === currentUser.userId);
    }

    return false;
  }
  return (
    <div className='flex items-center space-x-2'>
      <Button
        variant='link'
        size='sm'
        onClick={replyButtonAction}
      >
        Reply
      </Button>
      <div className='flex items-center gap-1'>
        {type === 'kudo' ? (
          <KudoLikeButton
            isLiked={isLiked()}
            kudoId={kudo?.id as string}
            userId={currentUser?.userId as string}
            companyId={currentUser?.companyId as string}
            queryKey={QueryKeys.singleKudo(kudo!.id as string)}
            userLikes={kudo?.userLikes as UserLike[]}
          />
        ) : (
          <CommentLikeButton
            commentId={comment?.id as string}
            isLiked={isLiked()}
            userId={currentUser?.userId as string}
            commentLikes={comment?.commentLikes as CommentLike[]}
          />
        )}

        <p className='text-sm text-gray-500'>
          {type === 'kudo' ? kudo.likes : comment ? comment?.likes : '0'}
        </p>
      </div>
    </div>
  );
}
