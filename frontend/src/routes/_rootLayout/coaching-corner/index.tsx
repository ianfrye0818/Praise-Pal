import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_rootLayout/coaching-corner/')({
  component: CoachingCornerPage,
});

function CoachingCornerPage() {
  return <div>Hello From Coaching Page</div>;
}
