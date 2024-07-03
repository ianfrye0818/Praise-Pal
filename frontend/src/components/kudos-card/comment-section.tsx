import { Comment } from '@/types';
import CommentComponent from './comment-component';
import CommentInputComponent from './comment-input';

export default function CommentSectionComponent({ comments }: { comments: Comment[] }) {
  return (
    <div className='space-y-4'>
      <div className='font-medium'>Comments</div>
      <div className='space-y-4'>
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            {...comment}
          />
        ))}
      </div>
      <CommentInputComponent placeholder='Add a comment to this kudo' />
    </div>
  );
}
