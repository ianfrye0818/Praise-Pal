import * as z from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Control, FieldPath } from 'react-hook-form';
import { SelectProps } from '@radix-ui/react-select';

interface Option {
  value: string;
  label: string;
}

interface FormSelectItemProps<T extends z.ZodTypeAny> extends SelectProps {
  control: Control<z.infer<T>, any>;
  name: FieldPath<z.infer<T>>;
  label?: string;
  placeholder?: string;
  options: Option[];
  defaultValue?: string; // Add defaultValue to props
}

export default function FormSelectItem<T extends z.ZodTypeAny>({
  control,
  name,
  label,
  placeholder,
  options,
  ...props
}: FormSelectItemProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              {...props}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
