import { generateQueryString } from '@/lib/utils';
import {
  CommentQueryParams,
  CompanyQueryParams,
  KudosQueryParams,
  UserNotificationQueryParams,
  UserQueryParams,
} from '@/types';

export const ApiRoutes = {
  auth: {
    baseUrl: '/auth',
    login: '/login',
    register: '/register',
    refresh: '/refresh',
    logout: '/logout',
    sendResetPasswordEmail: '/reset-password',
  },
  users: {
    baseUrl: '/user',
    findAll: (query?: UserQueryParams) => `/user?${generateQueryString(query)}`,
    findAllByCompany: (companyCode: string, query?: Omit<UserQueryParams, 'companyCode'>) =>
      `/user/company/${companyCode}?${generateQueryString(query)}`,
    findOneById: (companyCode: string, userId: string) =>
      `/user/${userId}?companyCode=${companyCode}`,
    createUser(companyCode: string) {
      return `/user/create?companyCode=${companyCode}`;
    },

    updateUserById: (companyCode: string, userId: string) =>
      `/user/${userId}?companyCode=${companyCode}`,
    deleteUserById: (companyCode: string, userId: string) =>
      `/user/${userId}?companyCode=${companyCode}`,
    restoreUserById: (companyCode: string, userId: string) =>
      `/user/${userId}/restore?companyCode=${companyCode}`,
    verifyUser: (companyCode: string, userId: string) =>
      `/verify/verify-user/${userId}?companyCode=${companyCode}`,
  },
  kudoLikes: {
    baseUrl: '/likes',
    createLike: (kudosId: string) => `/likes/${kudosId}`,
    deleteLike: (kudosId: string) => `/likes/${kudosId}`,
  },
  kudos: {
    baseUrl: '/kudos',
    findAll: (query: KudosQueryParams) => `/kudos?${generateQueryString(query)}`,
    findOneById: (companyCode: string, kudosId: string) =>
      `/kudos/${kudosId}?companyCode=${companyCode}`,
    createKudo: (companyCode: string) => `/kudos?companyCode=${companyCode}`,
    updateKudoById: (companyCode: string, kudosId: string) =>
      `/kudos/${kudosId}?companyCode=${companyCode}`,
    deleteKudoById: (companyCode: string, kudosId: string) =>
      `/kudos/${kudosId}?companyCode=${companyCode}`,
  },
  comments: {
    baseUrl: '/comments',
    findAll: (query?: CommentQueryParams) => `/comments?${generateQueryString(query)}`,
    findOneById: (companyCode: string, commentId: string) =>
      `/comments/${commentId}?companyCode=${companyCode}`,
    createComment: (companyCode: string) => `/comments?companyCode=${companyCode}`,
    updateCommentById: (companyCode: string, commentId: string) =>
      `/comments/${commentId}?companyCode=${companyCode}`,
    deleteCommentById: (companyCode: string, commentId: string) =>
      `/comments/${commentId}?companyCode=${companyCode}`,
  },
  commentLikes: {
    base: '/comment-likes',
    createLike: (commentId: string) => `/comment-likes/${commentId}`,
    deleteLike: (commentId: string) => `/comment-likes/${commentId}`,
  },
  company: {
    baseUrl: '/company',
    findAll: (query?: CompanyQueryParams) => `/company?${generateQueryString(query)}`,
    findOneById: (companyCode: string) => `/company/${companyCode}`,
    updateCompanyById: (companyCode: string) => `/company/${companyCode}`,
  },
  userNotifications: {
    baseUrl: '/user-notifications',
    findAll: (query?: UserNotificationQueryParams) =>
      `/user-notifications?${generateQueryString(query)}`,
    markAllAsRead: () => `/user-notifications/mark-all-as-read`,
    markSingleAsRead: (notificationId: string) =>
      `/user-notifications/${notificationId}/mark-as-read`,
    deleteNotificationById: (notificationId: string) => `/user-notifications/${notificationId}`,
  },
  verify: {
    baseUrl: '/verify',

    verifyAndUpdatePasswordWithToken: (token: string) => `/update-password/${token}`,
  },
};
