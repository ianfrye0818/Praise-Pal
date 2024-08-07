import { TKudos } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { capitalizeString, cn, getUserDisplayName, timeAgo } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { QueryKeys } from '@/constants';
import UserAvitar from '../ui/user-avatar';
import KudoLikeButton from '../switches-and-buttons/kudo-like-button';
import KudoCardDropDownMenu from '../dialogs-and-menus/kudo-card-dropdown-menu';

type Props = {
  kudo: TKudos;
};

export default function KudosCard({ kudo }: Props) {
  const { user } = useAuth().state;
  const { sender, receiver } = kudo;
  const isLiked = kudo.kudoLikes
    ? kudo.kudoLikes.some((kudoLike) => kudoLike.userId === user?.userId)
    : false;
  const usersKudo = sender ? sender.userId === user?.userId : false;
  const senderDisplayName = sender ? getUserDisplayName(sender) : '';
  const receiverDisplayName = sender ? getUserDisplayName(receiver) : '';
  return (
    <div
      className={cn(
        'flex items-center w-full p-4 bg-white shadow-md rounded-lg my-8 dark:bg-gray-800 dark:text-gray-200',
        kudo.isHidden && 'opacity-50'
      )}
    >
      <UserAvitar displayName={senderDisplayName} />
      <div className='ml-4 flex-1'>
        <div className='flex justify-between items-center'>
          <p className='font-bold text-customBlue'>
            {' '}
            {kudo.isAnonymous ? 'Someone Special' : capitalizeString(senderDisplayName)} sent kudos
            to {capitalizeString(receiverDisplayName)}
          </p>
          <p className='text-sm text-gray-500 hidden md:block'>{timeAgo(kudo.createdAt)}</p>
        </div>
        <div className='flex gap-2 items-center'>
          {kudo.title && <h3 className='font-bold text-lg my-2'>{capitalizeString(kudo.title)}</h3>}
          {kudo.isHidden && <p className='font-bold italic'>{'(Hidden)'}</p>}
        </div>
        <p>{kudo.message}</p>
        <div className='mt-2 flex items-center justify-between'>
          <div className='flex m-0 gap-3 items-center'>
            <div className='flex items-center gap-1'>
              <KudoLikeButton
                isLiked={isLiked}
                kudoId={kudo.id}
                userId={user?.userId as string}
                companyCode={user?.companyCode as string}
                kudoLikes={kudo.kudoLikes}
              />

              <p className='text-sm text-gray-500'>{kudo.likes}</p>
            </div>

            <Link
              className='flex items-center gap-1 '
              to='/kudos/$kudosId'
              params={{ kudosId: kudo.id }}
            >
              <MessageCircle className='size-4 cursor-pointer text-gray-400' />

              <p className='text-sm text-gray-500'>{kudo.comments?.length}</p>
            </Link>
          </div>
          {usersKudo && (
            <KudoCardDropDownMenu
              kudo={kudo}
              querKey={QueryKeys.allKudos}
            />
          )}
        </div>
      </div>
    </div>
  );
}
