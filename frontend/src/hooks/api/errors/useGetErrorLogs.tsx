import { getAllErrorLogs, getErrorLogById } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { QueryKey, useQuery } from '@tanstack/react-query';

interface UseGetErrorLogsProps {
  errorId?: string;
  type: 'single' | 'all';
  queryKey?: QueryKey;
}

export default function useGetErrorLogs({ type, errorId, queryKey }: UseGetErrorLogsProps) {
  const query = useQuery({
    queryKey: queryKey ? queryKey : QueryKeys.allErrorLogs,
    queryFn: async () => {
      if (type === 'all') {
        return await getAllErrorLogs();
      }
      if (type === 'single') {
        if (!errorId) throw new Error('errorId is required for single error log');
        return await getErrorLogById(errorId);
      }
      throw new Error('Invalid type');
    },
  });

  return query;
}
