import useResetPassword from '@/hooks/api/useResetPassword';
import { Form } from '../ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputItem } from '../forms/form-input-item';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await sendResetLink(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(['sendResetLinkError'], error);
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

        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            type='button'
            variant={'outline'}
          >
            Cancel
          </Button>
          <Button
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
