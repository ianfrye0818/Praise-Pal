import { patchUpdateCompany } from '@/api/api-handlers';
import { COMPANY_QUERY_OPTIONS } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { UpdateCompanyProps } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateCompany() {
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
      queryClient.setQueriesData(COMPANY_QUERY_OPTIONS, context?.previousData);
      errorToast({ message: err.message });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(COMPANY_QUERY_OPTIONS);
      successToast({ message: 'Company updated successfully' });
    },
  });
  return mutation;
}
