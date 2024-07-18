import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';
import { FormInputItemProps } from './form-input-item';

export function FormTextAreaItem<T extends z.ZodTypeAny>({
  control,
  name,
  label,
  placeholder,
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
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
