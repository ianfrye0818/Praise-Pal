import { Comment } from '@/types';
import CommentComponent from './comment-component';

export default function CommentList({ comments }: { comments?: Comment[] }) {
  return comments && comments.length > 0 ? (
    <>
      {comments.map((reply) => (
        <CommentComponent
          {...reply}
          key={reply.id}
        />
      ))}
    </>
  ) : null;
}
