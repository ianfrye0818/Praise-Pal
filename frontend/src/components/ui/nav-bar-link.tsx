import { SidebarLink } from '@/types';
import { Link } from '@tanstack/react-router';

type Props = {
  link: SidebarLink;
  notificationAmount?: number;
} & React.ComponentProps<typeof Link>;

export default function NavBarLink({ link, ...props }: Props) {
  return (
    <Link
      {...props}
      activeProps={{
        className: 'bg-navLink text-navLink-foreground',
      }}
      className='flex gap-3 items-center p-3 rounded-md relative'
      key={link.label}
      to={link.route as string}
    >
      <div className='relative size-6'>
        <link.icon />
      </div>
      <p>{link.label}</p>
    </Link>
  );
}
