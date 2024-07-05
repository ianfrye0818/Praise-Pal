import { Comment } from '@/types';
import CommentInput from './comment-input';
import useUpdateComment from '@/hooks/api/useComments.tsx/useUpdateComment';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function EditCommentForm({
  setEditMode,
  comment,
}: {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  comment: Comment;
}) {
  const { user: currentUser } = useAuth().state;
  const { mutateAsync: updateComment } = useUpdateComment(currentUser?.companyId as string);
  const [editContentValue, setEditContentValue] = useState(comment.content);
  return (
    <form
      className='w-full max-w-[90%]'
      onSubmit={(e) => {
        e.preventDefault();
        updateComment({ commentId: comment.id, content: editContentValue });
        setEditMode(false);
      }}
    >
      <CommentInput
        className='w-full'
        // defaultValue={comment.content}
        value={editContentValue}
        onChange={(e) => setEditContentValue(e.target.value)}
      />
    </form>
  );
}
