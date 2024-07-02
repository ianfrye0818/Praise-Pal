import { getUserDisplayName } from '@/lib/utils';
import { Comment } from '@/types';

import { Avatar, AvatarFallback } from '../ui/avatar';
import KudoLikeButton from './kudo-like-button';

interface KudoCommentListProps {
  comments: Comment[];
}

export default function KudoCommentList({ comments }: KudoCommentListProps) {
  return (
    <div className='py-2 border px-3 my-3'>
      {comments.map((comment) => {
        const displayName = getUserDisplayName(comment.user);
        return (
          <div
            key={comment.id}
            className='flex gap-2 place-items-start'
          >
            <Avatar>
              <AvatarFallback>{displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p key={comment.id}>{comment.content}</p>
              {/* <KudoLikeButton /> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
