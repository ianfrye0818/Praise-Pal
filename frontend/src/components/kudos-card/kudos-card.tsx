import { TKudos } from '@/types';
import KudoCardDropDownMenu from './kudo-card-dropdown-menu';
import KudoLikeButton from './kudo-like-button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { capitalizeString, formatDate, getUserDisplayName } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import KudoCommentList from './kudo-comment-list';

type Props = {
  kudo: TKudos;
  commenting?: boolean;
};

export default function KudosCard({ kudo, commenting = false }: Props) {
  const { user } = useAuth().state;
  const { sender, receiver } = kudo;
  const isLiked = kudo.userLikes.some((userLike) => userLike.userId === user?.userId);
  const usersKudo = kudo.senderId === user?.userId;
  const senderDisplayName = getUserDisplayName(sender);
  const receiverDisplayName = getUserDisplayName(receiver);
  return (
    <div className='flex items-center p-4 bg-white shadow-md rounded-lg my-8 dark:bg-gray-800 dark:text-gray-200'>
      <Avatar>
        <AvatarImage />
        <AvatarFallback className='avatar'>{senderDisplayName[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='ml-4 flex-1'>
        <div className='flex justify-between items-center'>
          <p className='font-bold text-customBlue'>
            {' '}
            {kudo.isAnonymous ? 'Someone Special' : capitalizeString(senderDisplayName)} sent kudos
            to {capitalizeString(receiverDisplayName)}
          </p>
          <p className='text-sm text-gray-500'>{formatDate(kudo.createdAt)}</p>
        </div>
        {kudo.title && <h3 className='font-bold text-lg my-2'>{capitalizeString(kudo.title)}</h3>}
        <p>{kudo.message}</p>
        <div className='mt-2 flex items-center justify-between'>
          <div className='flex m-0 gap-3 items-center'>
            <div className='flex items-center gap-1'>
              <KudoLikeButton
                isLiked={isLiked}
                kudoId={kudo.id}
                userId={user?.userId as string}
                companyId={user?.companyId as string}
              />

              <p className='text-sm text-gray-500'>{kudo.likes}</p>
            </div>

            {!commenting && (
              <Link
                className='flex items-center gap-1 '
                to='/kudos/$kudosId'
                params={{ kudosId: kudo.id }}
              >
                <MessageCircle className='size-4 cursor-pointer text-gray-400' />

                <p className='text-sm text-gray-500'>{kudo.comments.length}</p>
              </Link>
            )}
          </div>
          {usersKudo && <KudoCardDropDownMenu kudo={kudo} />}
        </div>

        {/* {commenting && <KudoCommentList comments={kudo.comments} />} */}
      </div>
    </div>
  );
}
