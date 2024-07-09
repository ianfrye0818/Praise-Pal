import { Comment } from '@/types';
import useUpdateComment from '@/hooks/api/useComments.tsx/useUpdateComment';
import { useAuth } from '@/hooks/useAuth';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import { FormInputItem } from '../forms/form-input-item';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { EditCommentSchema } from '@/zodSchemas';
import { useSingleKudoContext } from '@/hooks/useSingleKudoContext';
import { QueryKeys } from '@/constants';

export default function EditCommentForm({
  setEditMode,
  comment,
}: {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  comment: Comment;
}) {
  const { user: currentUser } = useAuth().state;
  const kudo = useSingleKudoContext();
  const { mutateAsync: updateComment } = useUpdateComment({
    companyId: currentUser?.companyId as string,
    commentQueryKey: QueryKeys.comments,
    kudoQueryKey: QueryKeys.singleKudo(kudo.id),
  });

  const form = useForm<z.infer<typeof EditCommentSchema>>({
    defaultValues: {
      content: comment.content,
      commentId: comment.id,
    },
    resolver: zodResolver(EditCommentSchema),
  });

  const onSubmit = async (data: z.infer<typeof EditCommentSchema>) => {
    await updateComment({ commentId: data.commentId, content: data.content });
    setEditMode(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className='w-full max-w-[90%] relative'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInputItem<typeof EditCommentSchema>
          control={form.control}
          name='content'
        />
        <Button
          className='absolute right-0 top-0 z-2 hover:bg-transparent'
          variant={'ghost'}
        >
          <Send />
        </Button>
      </form>
    </Form>
  );
}
