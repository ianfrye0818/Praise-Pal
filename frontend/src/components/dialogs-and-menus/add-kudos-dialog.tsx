import React from 'react';
import FormDialog from './form-dialog';
import AddKudosForm from '../forms/add-kudos-form';
import { QueryKey } from '@tanstack/react-query';

interface AddKudosDialogProps {
  children: React.ReactNode;
  queryKey?: QueryKey;
}

export default function AddKudosDialog({ children, queryKey }: AddKudosDialogProps) {
  return (
    <>
      <FormDialog
        form={AddKudosForm}
        description='Recognize your team members for their hard work!'
        title='Add Kudos'
        formProps={{ queryKey }}
      >
        {children}
      </FormDialog>
    </>
  );
}
