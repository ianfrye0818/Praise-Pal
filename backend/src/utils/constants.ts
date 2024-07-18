import { Injectable } from '@nestjs/common';

export const userSelectOptions = {
  userId: true,
  firstName: true,
  lastName: true,
  email: true,
  companyCode: true,
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

export const kudoLikeSelectOptions = {
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
  companyCode: true,
  sender: {
    select: userSelectOptions,
  },
  receiver: {
    select: userSelectOptions,
  },
  kudoLikes: {
    select: kudoLikeSelectOptions,
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
  kudoLikes: {
    select: kudoLikeSelectOptions,
  },
};

@Injectable()
export class ConstantsService {
  userSelectOptions = userSelectOptions;
  commentSelectOptions = commentSelectOptions;
  kudoLikeSelectOptions = kudoLikeSelectOptions;
  userNotificationSelectOptions = userNotificationSelectOptions;
  kudoSelectOptions = kudoSelectOptions;
  singleKudoSelectOptions = singleKudoSelectOptions;
  singleCommentSelectOptions = singleCommentSelectOptions;
}
