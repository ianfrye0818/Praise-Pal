import { Avatar, AvatarFallback } from './ui/avatar';

export default function UserAvitar({ displayName }: { displayName: string }) {
  return (
    <Avatar>
      <AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
