import { useController } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { FormInputItemProps } from './form-input-item';

export function CheckBoxInputItem<T extends z.ZodTypeAny>({
  control,
  name,
  label,
}: FormInputItemProps<T>) {
  const { field } = useController({
    name,
    control,
  });
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className='flex gap-2 items-center'>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>{label}</FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
