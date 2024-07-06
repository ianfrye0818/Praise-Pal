import useDeleteComment from '@/hooks/api/useComments.tsx/useDeleteComment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { EllipsisIcon } from 'lucide-react';
import { useState } from 'react';

interface CommentDropDownMenuProps {
  companyId: string;
  commentId: string;
  parentId?: string;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  canEdit: boolean;
}

export default function CommentDropDownMenu({
  commentId,
  companyId,
  parentId,
  setEditMode,
  children,
  canEdit,
}: CommentDropDownMenuProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: deleteComment } = useDeleteComment(companyId);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(open) => setOpen(open)}
    >
      <DropdownMenuTrigger className='hover:outline-none'>
        {children ? children : <EllipsisIcon size={16} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side='bottom'
        className='cursor-pointer p-2'
      >
        {canEdit && (
          <DropdownMenuItem
            className='p-1 hover:bg-gray-200 outline-1 hover:outline-none border-none rounded-md'
            onClick={() => {
              setEditMode(true);
            }}
          >
            Edit
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className='p-1 hover:bg-gray-200 outline-1 hover:outline-none border-none rounded-md'
          onClick={() => deleteComment({ commentId, parentId })}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
