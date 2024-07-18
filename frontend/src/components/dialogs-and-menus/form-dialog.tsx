import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import React, { useState } from 'react';

interface FormDialogProps {
  form: React.ElementType;
  formProps?: Record<string, any>;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function FormDialog({
  form: FormComponent,
  formProps = {},
  title,
  description,
  children,
}: FormDialogProps) {
  const [open, setOpen] = useState(false);
  formProps.setOpen = setOpen;
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => setOpen(open)}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {<FormComponent {...formProps} />}
      </DialogContent>
    </Dialog>
  );
}
