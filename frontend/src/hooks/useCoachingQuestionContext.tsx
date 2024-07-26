import { CoachingQuestionContext } from '@/routes/_rootLayout/coaching-corner/$questionId';
import { useContext } from 'react';

export function useCoachingQuestionContext() {
  const context = useContext(CoachingQuestionContext);
  if (!context) {
    throw new Error('useCoachingQuestion must be used within a CoachingQuestionProvider');
  }
  return context;
}
