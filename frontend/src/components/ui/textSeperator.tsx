import { cn } from '@/lib/utils';

export default function TextSeperator({
  text,
  borderThickness = '2px', // Default value for borderThickness
  borderColor = 'gray-200', // Default value for borderColor
  width,
}: {
  text: string;
  borderThickness?: string;
  borderColor?: string;
  width?: string;
}) {
  return (
    <div className={cn('flex gap-2 items-center ', width ? `w-${width}` : 'w-full')}>
      <hr
        className={cn(
          'flex-1 ',
          borderThickness ? `border-b-${borderThickness}` : 'border-b-2',
          borderColor ? `border-${borderColor}` : 'border-gray-200'
        )}
      />
      {text}
      <hr
        className={cn(
          'flex-1 ',
          borderThickness ? `border-b-${borderThickness}` : 'border-[4px]',
          borderColor ? `border-${borderColor}` : 'border-gray-200'
        )}
      />
    </div>
  );
}
