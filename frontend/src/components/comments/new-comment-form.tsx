import useCreateComment from '@/hooks/api/useComments.tsx/useCreateComment';
import { useAuth } from '@/hooks/useAuth';
import { useKudoContext } from '@/routes/_rootLayout/kudos/$kudosId.lazy';
import { useState } from 'react';
import CommentInputComponent from './comment-input';

export default function NewCommentForm({
  type,
  commentId,
  setReplyVisible,
}: {
  type: 'parent' | 'child';
  commentId?: string;
  setReplyVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user: currentUser } = useAuth().state;
  const kudo = useKudoContext();

  const { mutateAsync: createComment } = useCreateComment(currentUser?.companyId as string);
  const [newComment, setNewComment] = useState('');
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await createComment({
          content: newComment,
          parentId: type === 'child' && commentId ? commentId : undefined,
          kudosId: kudo.id,
          userId: currentUser?.userId as string,
        });
        setNewComment('');
        type === 'child' && setReplyVisible!(false);
      }}
    >
      <CommentInputComponent
        placeholder='Add a comment to this kudo'
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
    </form>
  );
}
