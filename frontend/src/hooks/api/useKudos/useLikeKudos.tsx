import { deleteRemoveLikeKudo, postAddLikeKudo } from '@/api/api-handlers';
import { KUDOS_QUERY_OPTIONS } from '@/constants';
import { TKudos } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface LikeKudoProps {
  kudoId: string;
  companyId: string;
  isLiked: boolean;
  userId: string;
}

export default function useLikeKudos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isLiked, kudoId }: LikeKudoProps) => {
      if (isLiked) {
        await deleteRemoveLikeKudo(kudoId);
      } else {
        await postAddLikeKudo(kudoId);
      }
    },
    onMutate: async ({ kudoId, isLiked }) => {
      await queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);
      const previousData = queryClient.getQueriesData(KUDOS_QUERY_OPTIONS);

      try {
        queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, (old: any) => {
          console.log('old: ', old);
          console.log(typeof old);

          // Check if old is an array
          if (Array.isArray(old)) {
            return old.map((kudo: TKudos) => {
              if (kudo && kudo.id === kudoId) {
                return {
                  ...kudo,
                  likes: isLiked ? kudo.likes - 1 : kudo.likes + 1,
                  isLiked: !isLiked,
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
    onError: (_, __, context) => {
      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, context?.previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
    },
  });
}
