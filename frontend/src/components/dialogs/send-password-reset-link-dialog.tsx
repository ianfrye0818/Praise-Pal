import useResetPassword from '@/hooks/api/useResetPassword';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useState } from 'react';
import { Form } from '../ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputItem } from '../forms/form-input-item';

const FormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function SendPassWordResetLinkDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: sendResetLink } = useResetPassword({ type: 'sendResetPassword' });
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: { email: '' },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      console.log(data);
      await sendResetLink(data);
      form.reset();
    } catch (error) {
      console.error(['sendResetLinkError'], error);
    }
  };

  return (
    <>
      <AlertDialog
        open={open}
        onOpenChange={(open) => setOpen(open)}
      >
        <AlertDialogTrigger>{children}</AlertDialogTrigger>

        <AlertDialogContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-4'
            >
              <AlertDialogTitle>Reset Password</AlertDialogTitle>

              <AlertDialogDescription>
                Enter your email below to receive a password reset link.
              </AlertDialogDescription>

              <FormInputItem<typeof FormSchema>
                control={form.control}
                name='email'
                placeholder='Email'
              />

              <AlertDialogFooter>
                <AlertDialogCancel
                  type='button'
                  onClick={() => {
                    setOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type='submit'>Send</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
