import useAdminMode from '@/hooks/useAdminMode';
import { useAuth } from '@/hooks/useAuth';
import { SidebarLink } from '@/types';
import { Link } from '@tanstack/react-router';

type Props = {
  link: SidebarLink;
  notificationAmount?: number;
} & React.ComponentProps<typeof Link>;

export default function NavBarLink({ link, ...props }: Props) {
  const { setAdminMode } = useAdminMode();
  const { isAdmin } = useAuth().state;
  const isAdminLink = link.label === 'Admin Dashboard';
  const isBackLink = link.label === 'Back';

  if (isAdminLink && !isAdmin) {
    return null;
  }
  return (
    <Link
      onClick={() => (isAdminLink ? setAdminMode(true) : isBackLink ? setAdminMode(false) : null)}
      {...props}
      activeProps={{
        className: 'bg-navLink text-navLink-foreground',
      }}
      className={`flex gap-3 items-center p-3 rounded-md `}
      key={link.label}
      to={link.route as string}
    >
      <div className='relative size-6'>
        <link.icon size={25} />
      </div>
      <p>{link.label}</p>
    </Link>
  );
}
