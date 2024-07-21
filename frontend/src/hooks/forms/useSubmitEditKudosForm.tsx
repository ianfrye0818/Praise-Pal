import * as z from 'zod';
import { EditKudosSchema } from '@/zodSchemas';
import useUpdateKudo from '../api/useKudos/useUpdateKudo';
import { QueryKey } from '@tanstack/react-query';

export default function useSubmitEditKudosForm(queryKey?: QueryKey) {
  const { mutateAsync } = useUpdateKudo(queryKey);

  async function onSubmit(data: z.infer<typeof EditKudosSchema>) {
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
