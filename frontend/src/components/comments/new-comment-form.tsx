import useCreateComment from '@/hooks/api/useComments.tsx/useCreateComment';
import { useAuth } from '@/hooks/useAuth';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputItem } from '../forms/form-input-item';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { NewCommentSchema } from '@/zodSchemas';
import { useSingleKudoContext } from '@/hooks/useSingleKudoContext';

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
  const kudo = useSingleKudoContext();

  const { mutateAsync: createComment } = useCreateComment(currentUser?.companyId as string);

  const form = useForm<z.infer<typeof NewCommentSchema>>({
    defaultValues: {
      content: '',
      parentId: type === 'child' && commentId ? commentId : undefined,
      kudosId: kudo.id,
      userId: currentUser?.userId as string,
    },
    resolver: zodResolver(NewCommentSchema),
  });

  const onSubmit = async (data: z.infer<typeof NewCommentSchema>) => {
    await createComment(data);
    type === 'child' && setReplyVisible!(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='relative min-w-[300px]'
      >
        <FormInputItem<typeof NewCommentSchema>
          control={form.control}
          name='content'
          placeholder={type === 'child' ? 'Reply to comment' : 'Add a comment'}
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
