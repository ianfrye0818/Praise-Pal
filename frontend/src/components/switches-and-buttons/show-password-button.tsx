import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface ShowPasswordButtonProps {
  isVisable: boolean;
  setIsVisable: (value: React.SetStateAction<boolean>) => void;
}

export default function ShowPasswordButton({ isVisable, setIsVisable }: ShowPasswordButtonProps) {
  return (
    <Button
      aria-label={isVisable ? 'Hide password' : 'Show password'}
      asChild
    >
      <>
        {!isVisable ? (
          <EyeIcon
            onClick={() => setIsVisable((prev) => !prev)}
            size={20}
            className='absolute right-3 top-1/2 -translate-y-1/2'
          />
        ) : (
          <EyeOffIcon
            onClick={() => setIsVisable((prev) => !prev)}
            size={20}
            className='absolute right-3 top-1/2 -translate-y-1/2'
          />
        )}
      </>
    </Button>
  );
}
