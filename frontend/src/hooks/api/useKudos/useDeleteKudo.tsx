import { deleteSingleKudo } from '@/api/api-handlers';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteKudoProps {
  companyId: string;
  kudoId: string;
}

export default function useDeleteKudo({ companyId, kudoId }: DeleteKudoProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['companyKudos', companyId],
    mutationFn: async () => await deleteSingleKudo(companyId, kudoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyKudos', companyId] });
    },
  });

  return mutation;
}