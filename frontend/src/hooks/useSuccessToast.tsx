import { useToast } from '@/components/ui/use-toast';
import { capitalizeString } from '@/lib/utils';

interface successToastProps {
  message: string;
  title?: string;
  duration?: number;
}

export default function useSuccessToast() {
  const { toast } = useToast();

  const successToast = ({ message, title, duration }: successToastProps) => {
    toast({
      title: title ? capitalizeString(title) : 'Success!',
      description: capitalizeString(message),
      variant: 'success',
      duration,
    });
  };

  return { successToast };
}
