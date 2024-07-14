// import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
// import { useState } from 'react';
// import { User } from '@/types';
// import DeleteAccountConfirmation from './delete-account-confirmation';

// export default function UpdateUserDialog({
//   updatingUser,
//   children,
//   currentUser,
//   disabled,
// }: {
//   updatingUser: User;
//   children?: React.ReactNode;
//   currentUser: User;
//   disabled?: boolean;
// }) {
//   const [open, setOpen] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(open) => {
//         setOpen(open);
//         setDeleting(false);
//       }}
//     >
//       <DialogTrigger disabled={disabled ? disabled : false}>{children}</DialogTrigger>

//       <DialogContent>
//         {deleting ? (
//           <DeleteAccountConfirmation
//             user={updatingUser}
//             currentUser={currentUser}
//             action={}
//             setOpen={setOpen}
//           />
//         ) : (
//           <UpdateAccountDialog
//             updatingUser={updatingUser}
//             setOpen={setOpen}
//             setDeleting={setDeleting}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
