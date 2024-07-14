import { Button, ButtonVariantProps } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';

interface ConfirmationDialogProps {
  children: React.ReactNode;
  action: any;
  title: string;
  description: string;
  cancelButtonText?: string;
  cancelButtonVariant?: ButtonVariantProps;
  actionButtonText?: string;
  actionButtonVariant?: ButtonVariantProps;
  content?: React.ElementType;
  contentProps?: Record<string, any>;
}

export default function ConfirmationDialog({
  children,
  cancelButtonVariant = 'outline',
  action,
  title,
  actionButtonText = 'Confirm',
  actionButtonVariant = 'default',
  cancelButtonText = 'Cancel',
  description,
  content: Content,
  contentProps = {},
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm();
  const { toast } = useToast();

  const handleAction = async () => {
    try {
      action();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {Content && <Content {...contentProps} />}
        <DialogFooter>
          <div className='flex justify-between w-full'>
            <Button
              variant={cancelButtonVariant}
              type='button'
              onClick={() => setOpen(false)}
            >
              {cancelButtonText}
            </Button>
            <Button
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(handleAction)}
              variant={actionButtonVariant}
            >
              {actionButtonText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
