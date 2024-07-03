import { ActionType, Role, User } from '@prisma/client';

export interface ClientUser {
  email: string;
  userId: string;
  companyId: string;
  role?: Role;
  displayName: string;
  firstName?: string;
  lastName?: string;
}
export interface ClientComment {
  id: string;
  content: string;
  kudosId: string;
  parentId?: string;
  user: ClientUser;
  createdAt: Date;
  comments: ClientComment[];
}

export interface ClientUserNotification {
  id: string;
  userId: string;
  actionType: ActionType;
  isRead: boolean;
  createAt: string;
}

export interface ClientKudos {
  id: string;
  message: string;
  title: string;
  createdAt: Date;
  likes: number;
  isAnonymous: boolean;
  sender: ClientUser;
  receiver: ClientUser;
  comments: ClientComment[];
  userLikes: { uerId: string; kudosId: string }[];
}
export interface JWTPayload extends ClientUser {
  iat: number;
  exp: number;
}
