import { deleteRemoveLikeKudo, postAddLikeKudo } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import { TKudos, UserLike } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface LikeKudoProps {
  kudoId: string;
  isLiked: boolean;
  userLikes: UserLike[];
  userId: string;
}

export default function useLikeKudos(queryKey: QueryKey = QueryKeys.allKudos) {
  const KUDOS_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();

  return useMutation({
    mutationFn: async ({ isLiked, kudoId }: LikeKudoProps) => {
      if (isLiked) {
        await deleteRemoveLikeKudo(kudoId);
      } else {
        await postAddLikeKudo(kudoId);
      }
    },
    onMutate: async ({ kudoId, isLiked, userLikes, userId }) => {
      await queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);
      const previousData = queryClient.getQueriesData(KUDOS_QUERY_OPTIONS);

      try {
        queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, (old: any) => {
          if (Array.isArray(old)) {
            return old.map((kudo: TKudos) => {
              if (kudo && kudo.id === kudoId) {
                return {
                  ...kudo,
                  likes: isLiked ? kudo.likes - 1 : kudo.likes + 1,
                  userLikes: isLiked
                    ? userLikes.filter((like: any) => like.userId !== userId)
                    : [...userLikes, { userId }],
                };
              } else {
                return kudo;
              }
            });
          }

          // Check if old is a single object
          if (typeof old === 'object' && old !== null && old.id === kudoId) {
            return {
              ...old,
              likes: isLiked ? old.likes - 1 : old.likes + 1,
              isLiked: !isLiked,
            };
          }

          return old;
        });
      } catch (error) {
        console.error('error: ', error);
      }
      return { previousData };
    },
    onError: (err, __, context) => {
      console.error(['useLikeKudos'], err);
      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, context?.previousData);
      errorToast({ message: 'Error liking kudos, please try again later. ' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
    },
  });
}
