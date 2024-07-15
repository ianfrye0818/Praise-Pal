import ConfirmationDialog from '@/components/dialogs-and-menus/confirmation-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useGetCompanyUser from '@/hooks/api/useCompayUsers/useGetCompanyUser';
import useUpdateCompanyUser from '@/hooks/api/useCompayUsers/useUpdateCompanyUser';
import useVerifyToken from '@/hooks/api/useVerifyToken';
import { useAuth } from '@/hooks/useAuth';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { cn } from '@/lib/utils';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_rootLayout/_adminLayout/admin/verify-user/$token')({
  component: VerifyTokenPage,
});

function VerifyTokenPage() {
  const { user: currentUser } = useAuth().state;
  const navigate = useNavigate();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const { token } = Route.useParams();
  const { data } = useVerifyToken({ token, type: 'NEW_USER' });
  const { data: user } = useGetCompanyUser({
    companyCode: currentUser!.companyCode,
    userId: data?.payload.userId as string,
  });
  const { mutateAsync: verify } = useUpdateCompanyUser();
  if (!data) return <div>Token could not be verified</div>;

  const { fullName, userId } = data.payload;

  const isActiveText = user?.isActive ? 'Active' : 'Inactive';

  const handleVerification = async () => {
    try {
      await verify({
        companyCode: currentUser!.companyCode,
        currentUser: currentUser!,
        userToUpdateId: userId,
        payload: { isActive: true },
      });
      successToast({ message: 'User verified successfully' });
      navigate({ to: '/admin/users' });
    } catch (error) {
      console.error(['Error verifying user', error]);
      errorToast({ message: 'Error verifying user' });
    }
  };

  return (
    <div className='h-[calc(100dvh-96px)] w-full flex flex-col items-center justify-center gap-6'>
      <Card className='w-full max-w-[450px]'>
        <CardHeader>
          <CardTitle>Verify User</CardTitle>
          <CardDescription>
            The user below is requesting enterance into your company.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          <div>
            <p>Name: {fullName}</p>
            <p>Email: {user?.email}</p>
            <p>CompanyCode: {user?.companyCode}</p>
            <p>
              CurrentStatus:{' '}
              <span className={cn('text-green-500', !user?.isActive && 'text-red-600')}>
                {isActiveText}
              </span>
            </p>
          </div>

          <CardFooter className='justify-end py-2 gap-3 items-center'>
            <Button
              variant={'outline'}
              onClick={() => navigate({ to: '/admin/dashboard' })}
            >
              Cancel
            </Button>
            <ConfirmationDialog
              action={handleVerification}
              description='Are you sure you want to verify this user?'
              title='Verify User'
              actionButtonText='Verify'
              actionButtonVariant={'confirm'}
            >
              <Button
                disabled={user?.isActive === true}
                variant={'confirm'}
              >
                Verify
              </Button>
            </ConfirmationDialog>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
