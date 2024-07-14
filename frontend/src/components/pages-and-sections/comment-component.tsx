import { useState } from 'react';
import { Comment, Role } from '@/types';
import { timeAgo, getUserDisplayName, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import LikeReplyButtons from '../switches-and-buttons/like-reply-buttons';
import UserAvitar from '../ui/user-avatar';
import CommentDropDownMenu from '../dialogs-and-menus/comment-drop-down-menu';
import CollapsibleCommentList from '../lists/collapsible-comment-list';
import EditCommentForm from '../forms/edit-comment-form';
import NewCommentForm from '../forms/new-comment-form';

export default function CommentComponent(comment: Comment) {
  const { user: currentUser } = useAuth().state;
  const [editMode, setEditMode] = useState(false);
  const [replyVisible, setReplyVisible] = useState(false);
  const senderDisplayName = comment.user ? getUserDisplayName(comment.user) : '';
  const canSeeDropDown =
    comment.user && currentUser
      ? comment.user.userId === currentUser?.userId ||
        currentUser?.role === Role.ADMIN ||
        currentUser?.role === Role.COMPANY_OWNER
      : false;
  const canEdit =
    comment.user && currentUser?.userId ? comment.user.userId === currentUser?.userId : false;

  return (
    <div
      className={cn(
        'flex items-start space-x-4 p-2 min-w-[300px] overflow-x-auto',
        !comment.parentId && 'border-l-2 border-gray-300 '
      )}
    >
      <UserAvitar displayName={senderDisplayName} />
      <div className='flex-1 space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-4 items-center'>
            <div className='flex flex-col'>
              <div className='font-medium'>{senderDisplayName}</div>
              <div className='text-xs text-muted-foreground hidden md:block'>
                {timeAgo(comment.createdAt)}
              </div>
            </div>
            {canSeeDropDown && (
              <CommentDropDownMenu
                commentId={comment.id}
                companyCode={currentUser?.companyCode as string}
                parentId={comment.parentId}
                setEditMode={setEditMode}
                canEdit={canEdit}
              />
            )}
          </div>
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

        <CollapsibleCommentList
          replyVisible={replyVisible}
          commentList={comment.comments || []}
        />
      </div>
    </div>
  );
}
