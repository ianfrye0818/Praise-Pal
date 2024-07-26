import { CoachingQuestion } from '@/types';
import { createFileRoute } from '@tanstack/react-router';
import { createContext, useState } from 'react';

export const CoachingQuestionContext = createContext<CoachingQuestion | null>(null);

export const Route = createFileRoute('/_rootLayout/coaching-corner/$questionId')({
  component: SingleCoachingQuestionPage,
});

function SingleCoachingQuestionPage() {
  const [question, setQuestion] = useState<CoachingQuestion | null>(null);
  return (
    <CoachingQuestionContext.Provider value={question}>
      <div>Hello From Coaching Page</div>
    </CoachingQuestionContext.Provider>
  );
}
