import { User } from '@prisma/client';
import { ClientUser } from 'src/types';

export function capitalizeWords(str: string) {
  const words = str.split(' ');
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

//genearte random 4 digit company code
export function generateCompanyCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function generateClientSideUserProperties(user: User) {
  const { password, createdAt, deletedAt, updatedAt, ...rest } = user;
  return rest;
}

export function getDisplayName(user: ClientUser, isAnonymous?: boolean) {
  return isAnonymous
    ? 'Someone Special'
    : user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName[0]}`
      : user.displayName;
}
