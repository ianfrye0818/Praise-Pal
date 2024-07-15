import FormDialog from './form-dialog';
import { Button } from '../ui/button';
import AddUserForm from '../forms/add-user-form';

export default function AddUserDialog() {
  return (
    <>
      <FormDialog
        form={AddUserForm}
        description='Fill out the form to add a new uesr'
        title='Add User'
      >
        <Button variant={'confirm'}>Add User</Button>
      </FormDialog>
    </>
  );
}
