import { Role, User } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isObjEmpty = (obj: object) => Object.keys(obj).length === 0;

export const createRefreshHeader = (refreshToken: string) => ({
  Authorization: `Bearer ${refreshToken}`,
});

export function generateQueryString(query?: any) {
  if (!query || isObjEmpty(query)) return '';

  return Object.keys(query)
    .filter((key) => query[key] !== undefined)
    .map((key) => `${key}=${query[key]}`)
    .join('&');
}

export function timeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diff = Number(now) - Number(past);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
  } else if (days < 7) {
    return days === 1 ? 'a day ago' : `${days} days ago`;
  } else if (weeks < 5) {
    return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
  } else if (months < 12) {
    return months === 1 ? 'a month ago' : `${months} months ago`;
  } else {
    return years === 1 ? 'a year ago' : `${years} years ago`;
  }
}

export function capitalizeString(str: string) {
  try {
    str = str.replace(/[^a-zA-Z0-9\s]/g, ' ');

    return str
      .trim()
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  } catch (e) {
    return str;
  }
}

export const getRoleOptions = () =>
  Object.values(Role)
    .filter((role) => role !== Role.SUPER_ADMIN)
    .map((role) => ({
      label: capitalizeString(role),
      value: role,
    }));

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
  resetPage?: boolean;
}
export function formUrlQuery({ params, key, value, resetPage = true }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  if (resetPage) {
    currentUrl.page = '1';
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getUserDisplayName(user: User) {
  return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '';
}

// export function sortUsersByCompanyOwnerThenName(users: User[]) {
//   users.sort((a, b) => {
//     if (a.role === Role.COMPANY_OWNER && b.role !== Role.COMPANY_OWNER) {
//       return -1;
//     }
//     if (a.role !== Role.COMPANY_OWNER && b.role === Role.COMPANY_OWNER) {
//       return 1;
//     }
//     if (a.firstName < b.firstName) {
//       return -1;
//     }
//     if (a.firstName > b.firstName) {
//       return 1;
//     }
//     return 0;
//   });
// }
