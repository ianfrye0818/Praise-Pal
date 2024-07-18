import useResetPassword from '@/hooks/api/useResetPassword';
import { Form } from '../ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputItem } from '../forms/form-input-item';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { isCustomError, isError } from '@/errors';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function PasswordResetForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mutateAsync: sendResetLink } = useResetPassword({ type: 'sendResetPassword' });
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema),
  });

  const globalErrors = form.formState.errors.root?.message;
  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await sendResetLink(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(['sendResetLinkError'], error);
      form.setError('root', {
        message: isCustomError(error) || isError(error) ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <FormInputItem<typeof formSchema>
          control={form.control}
          name='email'
          placeholder='Email'
        />
        {globalErrors && <p className='text-red-500 italic text-sm'>{globalErrors}</p>}
        <DialogFooter>
          <Button
            disabled={isSubmitting}
            onClick={() => setOpen(false)}
            type='button'
            variant={'outline'}
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting || !isValid}
            type='submit'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            Send Reset Link
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
