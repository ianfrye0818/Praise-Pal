import { Avatar, AvatarFallback } from './avatar';

export default function UserAvitar({ displayName }: { displayName?: string }) {
  return (
    <Avatar>
      <AvatarFallback>{displayName ? displayName[0].toUpperCase() : ''}</AvatarFallback>
    </Avatar>
  );
}
