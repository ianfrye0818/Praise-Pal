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

export const privateCoachingRoomSelectOptions = {
  id: true,
  coachingQuestionId: true,
  user: {
    select: userSelectOptions,
  },
  responder: {
    select: userSelectOptions,
  },
  createdAt: true,
  updatedAt: true,
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

export const coachingCommentSelectOptions = {
  id: true,
  coachingQuestionId: true,
  content: true,
  parentId: true,
  user: {
    select: userSelectOptions,
  },
  createdAt: true,
  comments: true,
};

export const coachingQuestionSelectOptions = {
  id: true,
  companyCode: true,
  title: true,
  question: true,
  author: { select: userSelectOptions },
  isAnonymous: true,
  isClosed: true,
  createdAt: true,
  updatedAt: true,
  comments: {
    select: coachingCommentSelectOptions,
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
  kudosId: true,
  coachingQuestionId: true,
  coachingCommentId: true,
  newUserId: true,
  commentId: true,
  companyCode: true,
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
