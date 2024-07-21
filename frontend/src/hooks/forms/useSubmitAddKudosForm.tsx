import { User } from '@/types';
import * as z from 'zod';

import { AddKudosSchema } from '@/zodSchemas';
import useCreateKudo from '../api/useKudos/useCreateKudo';
import { QueryKey } from '@tanstack/react-query';

export default function useSubmitAddKudosForm(
  user: User,
  // setOpen: React.Dispatch<React.SetStateAction<boolean>>
  queryKey?: QueryKey
) {
  const { mutateAsync } = useCreateKudo(queryKey);

  async function onSubmit(data: z.infer<typeof AddKudosSchema>) {
    try {
      await mutateAsync({
        ...data,
        senderId: user.userId,
        companyCode: user.companyCode,
      });
      // setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }
  return onSubmit;
}
