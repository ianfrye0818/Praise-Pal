import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Control, FieldPath, useController } from 'react-hook-form';
import { z } from 'zod';

export interface FormInputItemProps<T extends z.ZodTypeAny>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<z.infer<T>, any>;
  name: FieldPath<z.infer<T>>;
  label?: string;
  type?: string;
  onChange?: (...event: any[]) => void;
}

export function FormInputItem<T extends z.ZodTypeAny>({
  control,
  name,
  label,
  onChange,
  placeholder,
  type = 'text',
  ...props
}: FormInputItemProps<T>) {
  const { field } = useController({
    name,
    control,
  });

  let handleChange = field.onChange;

  if (name === 'companyCode') {
    handleChange = (event) => {
      // Remove non-alphanumeric characters and capitalize the value
      const filteredValue = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      field.onChange({ ...event, target: { ...event.target, value: filteredValue } });
      if (onChange) {
        onChange(event);
      }
    };
  }

  const customField = {
    ...field,
    onChange: handleChange,
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              {...customField}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
