import FormDialog from '../dialogs-and-menus/form-dialog';
import PasswordResetForm from '../dialogs-and-menus/send-password-reset-link-dialog';
import { Button } from '../ui/button';

export default function ForgotPasswordButton() {
  return (
    <p className='w-full text-left'>
      <FormDialog
        form={PasswordResetForm}
        description='Enter your email below to reset your password'
        title='Reset Password'
      >
        <Button
          className='p-0 text-blue-600'
          variant={'link'}
        >
          Forgot Password?
        </Button>
      </FormDialog>
    </p>
  );
}
