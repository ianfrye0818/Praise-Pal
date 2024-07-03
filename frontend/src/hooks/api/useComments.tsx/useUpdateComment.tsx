import { patchUpdateComment } from '@/api/api-handlers';
import { COMMENT_QUERY_OPTIONS, KUDOS_QUERY_OPTIONS } from '@/constants';
import { Comment } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateCommentProps {
  commentId: string;
  content: string;
  parentId?: string;
}

export default function useUpdateComment(companyId: string) {
  const queryClient = useQueryClient();

  const updateCommentInTree = (
    comments: Comment[],
    updatedComment: { id: string; content: string },
    parentId?: string
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === updatedComment.id) {
        return {
          ...comment,
          content: updatedComment.content,
        };
      }
      return {
        ...comment,
        comments: comment.comments
          ? updateCommentInTree(comment.comments, updatedComment, parentId)
          : [],
      };
    });
  };

  return useMutation({
    mutationFn: async ({ commentId, content }: UpdateCommentProps) => {
      await patchUpdateComment(companyId, commentId, content);
    },
    onMutate: async ({ commentId, content, parentId }) => {
      await queryClient.cancelQueries(COMMENT_QUERY_OPTIONS);
      await queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);

      const previousData = queryClient.getQueriesData(COMMENT_QUERY_OPTIONS);

      queryClient.setQueriesData(COMMENT_QUERY_OPTIONS, (old: any) => {
        if (Array.isArray(old)) {
          return updateCommentInTree(old, { id: commentId, content }, parentId);
        }
        return old;
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueriesData(COMMENT_QUERY_OPTIONS, context?.previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(COMMENT_QUERY_OPTIONS);
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
    },
  });
}
