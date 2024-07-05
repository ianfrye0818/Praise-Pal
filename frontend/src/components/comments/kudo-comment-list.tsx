import { getUserDisplayName } from '@/lib/utils';
import { Comment } from '@/types';
import UserAvitar from '../UserAvitar';

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
            <UserAvitar displayName={displayName} />
            <div>
              <p key={comment.id}>{comment.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
