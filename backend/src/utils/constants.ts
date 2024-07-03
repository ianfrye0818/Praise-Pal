import { Injectable } from '@nestjs/common';
import { DefaultArgs } from '@prisma/client/runtime/library';

export const userSelectOptions = {
  userId: true,
  displayName: true,
  firstName: true,
  lastName: true,
  email: true,
  companyId: true,
  role: true,
  createdAt: true,
};

export const commentLikeSelectOptions = {
  commentId: true,
  userId: true,
};

export const commentSelectOptions = {
  id: true,
  content: true,
  kudosId: true,
  parentId: true,
  likes: true,
  user: {
    select: userSelectOptions,
  },
  createdAt: true,
  comments: true,
  commentLikes: {
    select: commentLikeSelectOptions,
  },
};

export const singleCommentSelectOptions = {
  id: true,
  content: true,
  kudosId: true,
  parentId: true,
  likes: true,
  user: {
    select: userSelectOptions,
  },
  createdAt: true,
  comments: commentSelectOptions,
};

export const userLikeSelectOptions = {
  userId: true,
  kudosId: true,
};

export const userNotificationSelectOptions = {
  id: true,
  userId: true,
  actionType: true,
  isRead: true,
  createdAt: true,
  message: true,
  referenceId: true,
};

export const kudoSelectOptions = {
  id: true,
  message: true,
  title: true,
  createdAt: true,
  likes: true,
  isAnonymous: true,
  isHidden: true,
  sender: {
    select: userSelectOptions,
  },
  receiver: {
    select: userSelectOptions,
  },
  userLikes: {
    select: userLikeSelectOptions,
  },
};

export const singleKudoSelectOptions = {
  createdAt: true,
  id: true,
  message: true,
  title: true,
  likes: true,
  isAnonymous: true,
  sender: {
    select: userSelectOptions,
  },
  receiver: {
    select: userSelectOptions,
  },
  userLikes: {
    select: userLikeSelectOptions,
  },
};

@Injectable()
export class ConstantsService {
  userSelectOptions = userSelectOptions;
  commentSelectOptions = commentSelectOptions;
  userLikeSelectOptions = userLikeSelectOptions;
  userNotificationSelectOptions = userNotificationSelectOptions;
  kudoSelectOptions = kudoSelectOptions;
  singleKudoSelectOptions = singleKudoSelectOptions;
  singleCommentSelectOptions = singleCommentSelectOptions;
}
