import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface DeleteConfirmationFormProps {
  email: string;
  verifyEmail: string;
  setVerifyEmail: React.Dispatch<React.SetStateAction<string>>;
}

export default function DeleteConfirmationForm({
  email,
  verifyEmail,
  setVerifyEmail,
}: DeleteConfirmationFormProps) {
  return (
    <form>
      <Label htmlFor='verifyEmail'>
        Enter <span className='italic text-red-500'>{email}</span> to continue
      </Label>
      <Input
        id='verifyEmail'
        onChange={(e) => setVerifyEmail(e.target.value)}
        value={verifyEmail}
      />
    </form>
  );
}
