import { patchUpdateComment } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import { Comment } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateCommentProps {
  commentId: string;
  content: string;
  parentId?: string;
}

export default function useUpdateComment({
  commentQueryKey = QueryKeys.comments,
  companyId,
  kudoQueryKey = QueryKeys.allKudos,
}: {
  companyId: string;
  commentQueryKey: QueryKey;
  kudoQueryKey: QueryKey;
}) {
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();

  const COMMENT_QUERY_OPTIONS = { queryKey: commentQueryKey, exact: false };
  const KUDOS_QUERY_OPTIONS = { queryKey: kudoQueryKey, exact: false };

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
    onError: (err, __, context) => {
      queryClient.setQueriesData(COMMENT_QUERY_OPTIONS, context?.previousData);
      errorToast({ message: err.message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(COMMENT_QUERY_OPTIONS);
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
    },
  });
}
