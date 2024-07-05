import { useToast } from '@/components/ui/use-toast';
import { capitalizeString } from '@/lib/utils';

interface ErrorToastProps {
  message: string;
  title?: string;
  duration?: number;
}

export default function useErrorToast() {
  const { toast } = useToast();

  const errorToast = ({ message, title, duration }: ErrorToastProps) => {
    toast({
      title: title ? capitalizeString(title) : 'Error',
      description: capitalizeString(message),
      variant: 'destructive',
      duration: duration || 5000,
    });
  };

  return { errorToast };
}
