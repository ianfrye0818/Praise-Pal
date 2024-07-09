import { patchUpdateCompany } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';

import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { UpdateCompanyProps } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateCompany({
  queryKey = QueryKeys.company,
}: { queryKey?: QueryKey } = {}) {
  const COMPANY_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();

  const mutation = useMutation({
    mutationFn: async (payload: UpdateCompanyProps) => patchUpdateCompany(payload),
    onMutate: async (updatedCompany) => {
      await queryClient.cancelQueries(COMPANY_QUERY_OPTIONS);

      const previousData = queryClient.getQueriesData(COMPANY_QUERY_OPTIONS);

      queryClient.setQueriesData(COMPANY_QUERY_OPTIONS, (old: any) => {
        return { ...old, ...updatedCompany };
      });

      return { previousData };
    },
    onError: (err, __, context) => {
      console.error(['useUpdateCompany'], err, context);
      queryClient.setQueriesData(COMPANY_QUERY_OPTIONS, context?.previousData);
      errorToast({
        message:
          'Something went wrong updating your company - please try again or contact your administrator for assistance',
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(COMPANY_QUERY_OPTIONS);
      successToast({ message: 'Company updated successfully' });
    },
  });
  return mutation;
}
