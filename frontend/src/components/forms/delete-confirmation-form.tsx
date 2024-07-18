import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { Form } from '../ui/form';
import { FormInputItem } from './form-input-item';
import { zodResolver } from '@hookform/resolvers/zod';
import useDeleteCompanyUser from '@/hooks/api/useCompayUsers/useDeleteCompanyUser';
import useErrorToast from '@/hooks/useErrorToast';
import { isCustomError } from '@/errors';

interface DeleteConfirmationFormProps {
  email: string;
  userId: string;
  companyCode: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  verifiedEmail: z.string().email(),
});

export default function DeleteConfirmationForm({
  setOpen,
  email,
  companyCode,
  userId,
}: DeleteConfirmationFormProps) {
  const { errorToast } = useErrorToast();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      verifiedEmail: '',
    },
    resolver: zodResolver(formSchema),
  });
  const { mutateAsync: deleteUser } = useDeleteCompanyUser();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (data.verifiedEmail === email) {
        await deleteUser({ companyCode, userId });

        setOpen(false);
      } else {
        form.setError('verifiedEmail', { message: 'Email does not match' });
      }
    } catch (error) {
      console.error(['Error deleting user', error]);
      errorToast({ message: isCustomError(error) ? error.message : 'Error deleting user' });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-3 items-center'
      >
        <p>
          Please enter <span className='text-sm text-red-600 italic'>{email}</span> to confirm.
        </p>
        <div className='w-full'>
          <FormInputItem<typeof formSchema>
            control={form.control}
            name='verifiedEmail'
            placeholder='Verified Email'
          />
        </div>

        <DialogFooter className='w-full gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!form.formState.isValid}
            type='submit'
            variant={'destructive'}
          >
            Delete
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
