import { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import CommentList from './comment-list';
import { Comment } from '@/types';

export default function CollapsibleCommentList({
  commentList,
  replyVisible,
}: {
  commentList: Comment[];
  replyVisible: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (replyVisible) {
      setOpen(true);
    }
  }, [replyVisible]);

  return (
    <>
      {(commentList.length > 0 || replyVisible) && (
        <Collapsible
          open={open}
          onOpenChange={(open) => setOpen(open)}
        >
          <CollapsibleTrigger className='text-muted-foreground text-xs text-center'>
            {commentList.length > 0 ? (
              <p>
                {open ? 'Hide replies' : 'Show replies'} <span>({commentList.length})</span>
              </p>
            ) : null}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CommentList comments={commentList} />
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
}
