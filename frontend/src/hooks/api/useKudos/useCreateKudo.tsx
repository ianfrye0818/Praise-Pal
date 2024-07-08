import { postCreateKudo } from '@/api/api-handlers';
import { KUDOS_QUERY_OPTIONS } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { CreateKudoFormProps } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const placeholderKudo = {
  id: '1',
  comments: [],
  likes: 0,
  userLikes: [],
};

export default function useCreateKudo() {
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const mutation = useMutation({
    mutationFn: async (payload: CreateKudoFormProps) => await postCreateKudo(payload),
    onMutate: (payload) => {
      queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);

      const previousData = queryClient.getQueriesData(KUDOS_QUERY_OPTIONS);

      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, (old: any) => {
        if (Array.isArray(old)) {
          return [
            ...old,
            {
              ...payload,
              ...placeholderKudo,
            },
          ];
        } else {
          return placeholderKudo;
        }
      });

      return previousData;
    },
    onError: (_, __, context) => {
      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, context);
      errorToast({
        message: 'An error occured when creating Kudo, Please refresh the page and try again. ',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
      await queryClient.refetchQueries();
      successToast({ message: 'Kudo created successfully' });
    },
  });

  return mutation;
}
