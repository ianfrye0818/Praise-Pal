import ConfirmationAlertDialog from '@/components/dialogs-and-menus/confirmation-dialog';
import NotFoundComponent from '@/components/pages-and-sections/not-found-component';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import useGetCompanyUser from '@/hooks/api/useCompayUsers/useGetCompanyUser';
import { useAuth } from '@/hooks/useAuth';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { cn } from '@/lib/utils';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { User } from '@/types';
import useVerifyUser from '@/hooks/api/useCompayUsers/useVerifyUser';
import DataLoader from '@/components/ui/data-loader';

export const Route = createFileRoute('/_rootLayout/_adminLayout/admin/verify-user/$userId')({
  component: VerifyTokenPage,
});

function AlertDialogTemplate({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-left'>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className='text-left'>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
}

function UserDetails({ user }: { user: User }) {
  const fullName = `${user?.firstName} ${user?.lastName}`;
  const isActiveText = user?.isActive ? 'Active' : 'Inactive';

  return (
    <div>
      <p>Name: {fullName}</p>
      <p>Email: {user?.email}</p>
      <p>Company Code: {user?.companyCode}</p>
      <p>
        Current Status:{' '}
        <span className={cn('text-green-500', !user?.isActive && 'text-red-600')}>
          {isActiveText}
        </span>
      </p>
    </div>
  );
}

function VerifyTokenPage() {
  const { user: currentUser } = useAuth().state;
  const navigate = useNavigate();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const { userId } = Route.useParams();
  const { data: user, isLoading } = useGetCompanyUser({
    companyCode: currentUser!.companyCode,
    userId,
  });
  const { mutateAsync: verify } = useVerifyUser();

  if (isLoading) return <DataLoader />;
  if (!user) return <NotFoundComponent />;

  if (user.deletedAt !== null) {
    return (
      <AlertDialogTemplate title='This User has been Deleted'>
        <p>Please log into your dashboard to restore and activate user.</p>
        <AlertDialogFooter className='justify-center'>
          <Button asChild>
            <Link to='/admin/dashboard'>Return to Dashboard</Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogTemplate>
    );
  }

  if (user.isActive) {
    return (
      <AlertDialogTemplate title='This user has already been activated!'>
        <p>Please log into your dashboard to make any changes to this user.</p>
        <AlertDialogFooter className='justify-center'>
          <Button asChild>
            <Link to='/admin/dashboard'>Return to Dashboard</Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogTemplate>
    );
  }

  const handleVerification = async () => {
    try {
      await verify({
        companyCode: currentUser!.companyCode,
        userId: user.userId,
      });
      successToast({ message: 'User verified successfully' });
      navigate({ to: '/admin/users' });
    } catch (error) {
      console.error(['Error verifying user', error]);
      errorToast({ message: 'Error verifying user' });
    }
  };

  return (
    <AlertDialogTemplate
      title='Verify User'
      description='The user below is requesting entrance into your company.'
    >
      <UserDetails user={user} />
      <AlertDialogFooter className='justify-end py-2 gap-3 items-center'>
        <Button
          className='w-full md:w-auto'
          variant={'outline'}
          onClick={() => navigate({ to: '/admin/dashboard' })}
        >
          Cancel
        </Button>
        <ConfirmationAlertDialog
          action={handleVerification}
          description='Are you sure you want to verify this user?'
          title='Verify User'
          actionButtonText='Verify'
          actionButtonVariant={'confirm'}
        >
          <Button
            className='w-full md:w-auto'
            variant={'confirm'}
          >
            Verify
          </Button>
        </ConfirmationAlertDialog>
      </AlertDialogFooter>
    </AlertDialogTemplate>
  );
}

export default VerifyTokenPage;
