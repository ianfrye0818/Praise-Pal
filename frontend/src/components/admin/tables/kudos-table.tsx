import { DeleteKudoDialog } from '@/components/dialogs/delete-kudo-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useUpdateKudo from '@/hooks/api/useKudos/useUpdateKudo';
import { useAuth } from '@/hooks/useAuth';
import { getUserDisplayName, timeAgo } from '@/lib/utils';
import { TKudos } from '@/types';

interface UsersTableProps {
  kudos: TKudos[];
  showKudosNumber?: boolean;
}

export default function KudosTable({ kudos, showKudosNumber = true }: UsersTableProps) {
  const { mutateAsync: showHideKudo } = useUpdateKudo();
  const { user: currentUser } = useAuth().state;

  return (
    <>
      {showKudosNumber && <p className=' p-2 text-lg'>Total Kudos: {kudos.length}</p>}
      <div className='border shadow-sm rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Show/Hide</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kudos.map((kudo) => {
              const reciverDisplayName = kudo.receiver ? getUserDisplayName(kudo.receiver) : '';
              const senderDisplayName = kudo.sender ? getUserDisplayName(kudo.sender) : '';
              return (
                <TableRow key={kudo.id}>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='w-8 h-8 border'>
                        <AvatarFallback>{senderDisplayName[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className='flex gap-2 items-center'>{senderDisplayName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='w-8 h-8 border'>
                        <AvatarFallback>{reciverDisplayName[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className='flex gap-2 items-center'>{reciverDisplayName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{kudo.title}</TableCell>
                  <TableCell>{timeAgo(kudo.createdAt)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={kudo.isHidden}
                      onCheckedChange={async (isHidden: boolean) =>
                        await showHideKudo({
                          companyId: currentUser?.companyId as string,
                          payload: {
                            isHidden,
                            id: kudo.id,
                          },
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteKudoDialog kudo={kudo}>
                      <Button variant={'destructive'}>Delete</Button>
                    </DeleteKudoDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
