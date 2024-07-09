import { User } from '@/types';
import * as z from 'zod';

import { addKudoFormSchema } from '@/zodSchemas';
import useCreateKudo from '../api/useKudos/useCreateKudo';
import { QueryKey } from '@tanstack/react-query';

export default function useSubmitAddKudosForm(
  user: User,
  // setOpen: React.Dispatch<React.SetStateAction<boolean>>
  queryKey?: QueryKey
) {
  const { mutateAsync } = useCreateKudo(queryKey);

  async function onSubmit(data: z.infer<typeof addKudoFormSchema>) {
    try {
      await mutateAsync({
        ...data,
        senderId: user.userId,
        companyId: user.companyId,
      });
      // setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }
  return onSubmit;
}
