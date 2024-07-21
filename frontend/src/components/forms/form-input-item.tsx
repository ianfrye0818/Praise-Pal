'use client';
import { Control, FieldPath, useController } from 'react-hook-form';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { HTMLInputTypeAttribute, useState } from 'react';
import ShowPasswordButton from '../switches-and-buttons/show-password-button';

export interface FormInputItemProps<T extends z.ZodTypeAny>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<z.infer<T>, any>;
  name: FieldPath<z.infer<T>>;
  label?: string;
  type?: HTMLInputTypeAttribute;
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
  const obsureText = type === 'password';
  const [isVisable, setIsVisable] = useState<boolean>(!obsureText);
  const { field } = useController({
    name,
    control,
  });

  let handleChange = field.onChange;

  if (name === 'companyCode' || name.includes('state')) {
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
      render={({ field }) => {
        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className='relative'>
                <Input
                  type={isVisable ? 'text' : type}
                  placeholder={placeholder}
                  {...field}
                  {...customField}
                  {...props}
                />
                {obsureText && (
                  <ShowPasswordButton
                    setIsVisable={setIsVisable}
                    isVisable={isVisable}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
