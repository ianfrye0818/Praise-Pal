import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_rootLayout/_adminLayout/admin/verify-user/$token')({
  component: () => <div>Hello /_rootLayout/_adminLayout/admin/verify-user/$token!</div>,
});

function VerifyTokenPage() {
  const { token } = Route.useParams();
}
