import { deleteComment } from '@/api/api-handlers';
import { COMMENT_QUERY_OPTIONS, KUDOS_QUERY_OPTIONS } from '@/constants';
import { Comment } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function UseDeleteComment(companyId: string) {
  const queryClient = useQueryClient();

  const removeCommentFromTree = (
    comments: Comment[],
    commentId: string,
    parentId?: string
  ): Comment[] => {
    if (!parentId) {
      return comments.filter((comment) => comment.id !== commentId);
    }

    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          comments: comment.comments?.filter((c) => c.id !== commentId),
        };
      }
      return {
        ...comment,
        comments: comment.comments
          ? removeCommentFromTree(comment.comments, commentId, parentId)
          : [],
      };
    });
  };

  const mutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: string; parentId?: string }) =>
      await deleteComment(companyId, commentId),
    onMutate: async ({ commentId, parentId }) => {
      await queryClient.cancelQueries(COMMENT_QUERY_OPTIONS);
      await queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);

      const previousData = queryClient.getQueriesData(COMMENT_QUERY_OPTIONS);

      queryClient.setQueriesData(COMMENT_QUERY_OPTIONS, (old: any) => {
        if (Array.isArray(old)) {
          return removeCommentFromTree(old, commentId, parentId);
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

  return mutation;
}
