import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { Form } from '../ui/form';
import { FormInputItem } from './form-input-item';
import { zodResolver } from '@hookform/resolvers/zod';
import useDeleteCompanyUser from '@/hooks/api/useCompayUsers/useDeleteCompanyUser';
import { isCustomError } from '@/errors';

interface DeleteConfirmationFormProps {
  email: string;
  userId: string;
  companyCode: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setCanSubmit?: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  verifiedEmail: z.string().email(),
});

export default function DeleteConfirmationForm({
  setOpen,
  email,
  companyCode,
  userId,
  setMenuOpen,
  setCanSubmit,
}: DeleteConfirmationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      verifiedEmail: '',
    },
    resolver: zodResolver(formSchema),
  });
  const { mutateAsync: deleteUser } = useDeleteCompanyUser();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (data.verifiedEmail !== email) {
        form.setError('verifiedEmail', { message: 'Email does not match' });
        return;
      }
      await deleteUser({ companyCode, userId });

      setOpen(false);
      setMenuOpen && setMenuOpen(false);
      setCanSubmit && setCanSubmit(true);
    } catch (error) {
      console.error(['Error deleting user', error]);
      form.setError('root', {
        message: isCustomError(error) ? error.message : 'Error deleting user',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-3 items-center'
        onSubmit={form.handleSubmit(onSubmit)}
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
        {form.formState.errors.root && (
          <p className='text-sm italic text-red-600'>{form.formState.errors.root.message}</p>
        )}

        <DialogFooter className='w-full gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              setOpen(false);
              setCanSubmit && setCanSubmit(true);
            }}
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
