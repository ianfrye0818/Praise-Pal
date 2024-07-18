import { postCreateUser } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { addUserSchema } from '@/zodSchemas';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';

type CreateUserProps = z.infer<typeof addUserSchema>;

export default function useCreateCompanyUser(queryKey: QueryKey = QueryKeys.allUsers) {
  const USER_QUERY_OPTIONS = { queryKey, exact: false };
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: CreateUserProps) => {
      return await postCreateUser(data);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries(USER_QUERY_OPTIONS);
      const previousData = queryClient.getQueriesData(USER_QUERY_OPTIONS);

      queryClient.setQueriesData(USER_QUERY_OPTIONS, (old: any) => {
        if (Array.isArray(old)) {
          return [...old, data];
        }
        return [data];
      });
      return { previousData };
    },
    onError: (err) => {
      console.error(['useCreateCompanyUser'], err);
      errorToast({
        title: 'Error',
        message: 'Error creating user',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(USER_QUERY_OPTIONS);
      successToast({
        title: 'Success',
        message: 'User created successfully',
      });
    },
  });
  return mutation;
}
