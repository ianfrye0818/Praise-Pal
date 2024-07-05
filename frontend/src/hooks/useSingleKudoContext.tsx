import { CustomError } from '@/errors';
import { KudoContext } from '@/routes/_rootLayout/kudos/$kudosId.lazy';
import { useContext } from 'react';

export const useSingleKudoContext = () => {
  const context = useContext(KudoContext);
  if (!context)
    throw new CustomError('useSingleKudoContext must be used within a KudoContext.Provider');
  return context;
};
