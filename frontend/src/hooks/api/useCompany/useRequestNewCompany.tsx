import { postNewCompanyRequest } from '@/api/api-handlers';
import { CompanySignUpFormProps } from '@/types';
import { AddCompanyContactSchema, AddCompanySchema } from '@/zodSchemas';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

export type CleanedData = {
  companyInfo: z.infer<typeof AddCompanySchema>;
  contactInfo: Omit<z.infer<typeof AddCompanyContactSchema>, 'sameNumber'>;
};

const removeSameNumber = (data: CompanySignUpFormProps) => {
  const cleanedData = JSON.parse(JSON.stringify(data));
  delete cleanedData.contactInfo.sameNumber;
  return cleanedData as CleanedData;
};

export default function useRequestNewCompany() {
  const mutation = useMutation({
    mutationFn: async (data: CompanySignUpFormProps) => {
      const cleanedData = removeSameNumber(data);
      return await postNewCompanyRequest(cleanedData);
    },
  });

  return mutation;
}
