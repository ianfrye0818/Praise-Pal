import { useState } from 'react';
import { Comment } from '@/types';
import { timeAgo, getUserDisplayName } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import LikeReplyButtons from './like-reply-buttons';
import NewCommentForm from './new-comment-form';
import UserAvitar from '../UserAvitar';
import CommentDropDownMenu from './comment-drop-down-menu';
import EditCommentForm from './edit-comment-form';

export default function CommentComponent(comment: Comment) {
  const { user: currentUser } = useAuth().state;
  const [editMode, setEditMode] = useState(false);
  const [replyVisible, setReplyVisible] = useState(false);
  const senderDisplayName = getUserDisplayName(comment.user);
  const commentOwner = comment.user.userId === currentUser?.userId;

  return (
    <div className='flex items-start space-x-4'>
      <UserAvitar displayName={senderDisplayName} />
      <div className='flex-1 space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='font-medium'>{senderDisplayName}</div>
          <div className='text-xs text-muted-foreground'>{timeAgo(comment.createdAt)}</div>
        </div>
        <div className='flex gap-4'>
          {!editMode ? (
            <p>{comment.content}</p>
          ) : (
            <EditCommentForm
              comment={comment}
              setEditMode={setEditMode}
            />
          )}
          {commentOwner && (
            <CommentDropDownMenu
              commentId={comment.id}
              companyId={currentUser?.companyId as string}
              parentId={comment.parentId}
              setEditMode={setEditMode}
            />
          )}
        </div>
        <LikeReplyButtons
          type='comment'
          comment={comment}
          replyButtonAction={() => setReplyVisible(!replyVisible)}
        />
        {replyVisible && (
          <NewCommentForm
            setReplyVisible={setReplyVisible}
            type='child'
            commentId={comment.id}
          />
        )}
        <CommentList comments={comment.comments} />
      </div>
    </div>
  );
}

function CommentList({ comments }: { comments?: Comment[] }) {
  return comments && comments.length > 0 ? (
    <div>
      {comments.map((reply) => (
        <CommentComponent
          {...reply}
          key={reply.id}
        />
      ))}
    </div>
  ) : null;
}
