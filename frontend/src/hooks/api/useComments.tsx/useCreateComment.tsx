import { postCreateComment } from '@/api/api-handlers';
import { COMMENT_QUERY_OPTIONS, KUDOS_QUERY_OPTIONS } from '@/constants';
import { Comment, CreateCommentFormProps, Role } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreateComment(companyId: string) {
  const queryClient = useQueryClient();

  const addCommentToTree = (
    comments: Comment[],
    newComment: Comment,
    parentId?: string
  ): Comment[] => {
    if (!parentId) {
      return [...comments, newComment];
    }

    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          comments: [...(comment.comments || []), newComment],
        };
      }
      return {
        ...comment,
        comments: comment.comments ? addCommentToTree(comment.comments, newComment, parentId) : [],
      };
    });
  };

  return useMutation({
    mutationFn: async (payload: CreateCommentFormProps) =>
      await postCreateComment(companyId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries(COMMENT_QUERY_OPTIONS);

      const previousData = queryClient.getQueriesData(COMMENT_QUERY_OPTIONS);

      queryClient.setQueriesData(COMMENT_QUERY_OPTIONS, (old: any) => {
        const newComment: Comment = {
          ...payload,
          id: '1',
          comments: [],
          likes: 0,
          user: {
            companyId: companyId,
            displayName: 'Test User',
            email: 'test@test.com',
            role: Role.USER,
            userId: payload.userId,
            firstName: 'Test',
            lastName: 'User',
          },
          createdAt: new Date().toISOString(),
        };

        if (Array.isArray(old)) {
          return addCommentToTree(old, newComment, payload.parentId);
        }

        if (typeof old === 'object' && old !== null) {
          return {
            ...old,
            comments: addCommentToTree(old.comments || [], newComment, payload.parentId),
          };
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
