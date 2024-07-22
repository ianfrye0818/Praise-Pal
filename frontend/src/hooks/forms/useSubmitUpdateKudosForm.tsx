import * as z from 'zod';
import { UpdateKudosSchema } from '@/zodSchemas';
import useUpdateKudo from '../api/useKudos/useUpdateKudo';
import { QueryKey } from '@tanstack/react-query';

export default function useSubmitUpdateKudosForm(queryKey?: QueryKey) {
  const { mutateAsync } = useUpdateKudo(queryKey);

  async function onSubmit(data: z.infer<typeof UpdateKudosSchema>) {
    try {
      await mutateAsync({
        payload: data,
        companyCode: data.companyCode as string,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return onSubmit;
}
