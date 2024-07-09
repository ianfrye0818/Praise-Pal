import { ToastActionElement } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { capitalizeString } from '@/lib/utils';

interface ErrorToastProps {
  message: string;
  title?: string;
  duration?: number;
  action?: ToastActionElement;
}

export default function useErrorToast() {
  const { toast } = useToast();

  const errorToast = ({ message, title, duration, action }: ErrorToastProps) => {
    toast({
      title: title ? capitalizeString(title) : 'Error',
      description: capitalizeString(message),
      variant: 'destructive',
      duration: duration || 5000,
      action,
      className: 'flex flex-col gap-3 items-start',
    });
  };

  return { errorToast };
}
