import { deleteLikeComment, postAddLikeComment } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import { Comment } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface LikeCommentProps {
  commentId: string;
  isLiked: boolean;
}

export default function useLikeComments({
  commentQueryKey = QueryKeys.comments,
  kudoQueryKey = QueryKeys.allKudos,
}: {
  commentQueryKey?: QueryKey;
  kudoQueryKey?: QueryKey;
} = {}) {
  const COMMENT_QUERY_OPTIONS = { commentQueryKey, exact: false };
  const KUDOS_QUERY_OPTIONS = { kudoQueryKey, exact: false };
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();

  const updateLikesInTree = (
    comments: Comment[],
    commentId: string,
    isLiked: boolean
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !isLiked,
        };
      }
      return {
        ...comment,
        comments: comment.comments ? updateLikesInTree(comment.comments, commentId, isLiked) : [],
      };
    });
  };

  return useMutation({
    mutationFn: async ({ isLiked, commentId }: LikeCommentProps) => {
      if (isLiked) {
        await deleteLikeComment(commentId);
      } else {
        await postAddLikeComment(commentId);
      }
    },
    onMutate: async ({ commentId, isLiked }) => {
      await queryClient.cancelQueries(COMMENT_QUERY_OPTIONS);
      const previousData = queryClient.getQueriesData(COMMENT_QUERY_OPTIONS);

      try {
        queryClient.setQueriesData(COMMENT_QUERY_OPTIONS, (old: any) => {
          if (Array.isArray(old)) {
            return updateLikesInTree(old, commentId, isLiked);
          }

          if (typeof old === 'object' && old !== null) {
            return { ...old, comments: updateLikesInTree(old.comments || [], commentId, isLiked) };
          }

          return old;
        });
      } catch (error) {
        console.error('error: ', error);
      }
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
