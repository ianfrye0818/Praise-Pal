import * as z from 'zod';
import { editKudosFormSchema } from '@/zodSchemas';
import useUpdateKudo from '../api/useKudos/useUpdateKudo';
import { QueryKey } from '@tanstack/react-query';

export default function useSubmitEditKudosForm(queryKey?: QueryKey) {
  const { mutateAsync } = useUpdateKudo(queryKey);

  async function onSubmit(data: z.infer<typeof editKudosFormSchema>) {
    try {
      await mutateAsync({
        payload: data,
        companyCode: data.companyCode,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return onSubmit;
}
