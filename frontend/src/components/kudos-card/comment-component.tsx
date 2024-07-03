import { useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Comment } from '@/types';
import { formatDate, getUserDisplayName } from '@/lib/utils';
import CommentInput from './comment-input';
import CommentLikeButton from './comment-like-button';
import { CommandEmpty } from 'cmdk';
import { useAuth } from '@/hooks/useAuth';

export default function CommentComponent({
  content,
  user,
  createdAt,
  comments,
  id,
  commentLikes,
  likes,
}: Comment) {
  const { user: currentUser } = useAuth().state;
  const [replyVisible, setReplyVisible] = useState(false);
  const [newReply, setNewReply] = useState('');
  // const [replyList, setReplyList] = useState(replies);

  // const handleAddReply = () => {
  //   const newReplyObj: Comment = {
  //     id: replyList.length.toString(),
  //     author: 'Current User', // Replace with actual current user
  //     date: new Date().toLocaleDateString(),
  //     content: newReply,
  //     isLiked: false,
  //     replies: [],
  //   };
  //   setReplyList([...replyList, newReplyObj]);
  //   setNewReply('');
  //   setReplyVisible(false);
  // };
  const senderDisplayName = getUserDisplayName(user);
  const isLiked = commentLikes.some((commentLike) => commentLike.userId === currentUser?.userId);
  console.log(commentLikes, isLiked, currentUser?.userId);

  return (
    <div className='flex items-start space-x-4'>
      <Avatar className='w-8 h-8'>
        <AvatarFallback>{senderDisplayName[0]}</AvatarFallback>
      </Avatar>
      <div className='flex-1 space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='font-medium'>{senderDisplayName}</div>
          <div className='text-xs text-muted-foreground'>{formatDate(createdAt)}</div>
        </div>
        <p>{content}</p>
        <div className='flex items-center'>
          <Button
            variant='link'
            size='sm'
            onClick={() => setReplyVisible(!replyVisible)}
          >
            Reply
          </Button>

          <CommentLikeButton
            commentId={id}
            isLiked={isLiked}
            userId={user.userId}
          />

          <div className='text-xs text-muted-foreground'>{likes}</div>
        </div>
        {replyVisible && (
          <CommentInput
            onChange={(e) => setNewReply(e.target.value)}
            value={newReply}
            placeholder='Add a comment...'
            // onClick={handleAddReply}
          />
          // <div className='mt-2'>
          //   <Input
          //     placeholder='Add a comment...'
          //     value={newReply}
          //     onChange={(e) => setNewReply(e.target.value)}
          //   />
          //   <Button onClick={handleAddReply}>Submit</Button>
          // </div>
        )}
        {comments && comments?.length > 0 && (
          <div className='pl-6'>
            {comments.map((reply, index) => (
              <CommentComponent
                key={index}
                {...reply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
