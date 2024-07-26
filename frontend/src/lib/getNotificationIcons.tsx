import { ActionTypes } from '@/types';
import { FaComments } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import { MdCelebration } from 'react-icons/md';
import { LuUserPlus2 } from 'react-icons/lu';
import { FaQuestion } from 'react-icons/fa';

export function getNotificationIcon(type: ActionTypes) {
  const classNames = 'w-6 h-6';
  switch (type) {
    case ActionTypes.KUDOS:
      return <MdCelebration className={`text-yellow-600 ${classNames}`} />;
    case ActionTypes.COMMENT_COMMENT:
    case ActionTypes.KUDOS_COMMENT:
    case ActionTypes.COACHING_COMMENT:
    case ActionTypes.COACHING_COMMENT_COMMENT:
      return <FaComments className={` text-green-500 ${classNames}`} />;
    case ActionTypes.COMMENT_LIKE:
    case ActionTypes.KUDOS_LIKE:
      return <FcLike className={`${classNames}`} />;
    case ActionTypes.NEW_USER:
      return <LuUserPlus2 className={`text-blue-700 ${classNames}`} />;
    case ActionTypes.COACHING_QUESITON:
      return <FaQuestion className={`text-customLightBlue-200 ${classNames}`} />;
  }
}
