import { postCreateKudo } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { CreateKudoFormProps } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

const placeholderKudo = {
  id: '1',
  comments: [],
  likes: 0,
  userLikes: [],
  receiver: {
    userId: '2',
    firstName: 'Place',
    lastName: 'Holder',
  },
  sender: {
    userId: '3',
    firstName: 'Place',
    lastName: 'Holder',
  },
};

export default function useCreateKudo(queryKey: QueryKey = QueryKeys.allKudos) {
  const KUDOS_QUERY_OPTIONS = { queryKey, exact: false };
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
    onError: (err, __, context) => {
      console.error(['useCreateKudo'], err);
      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, context);
      errorToast({
        message: 'An error occured when creating Kudo, Please refresh the page and try again. ',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
      // await queryClient.refetchQueries();
      successToast({ message: 'Kudo created successfully' });
    },
  });

  return mutation;
}
