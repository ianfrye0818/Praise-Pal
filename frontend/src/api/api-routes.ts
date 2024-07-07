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
    sendVerifyEmailEmail: '/verify-email',
    verifyToken: (token: string) => `/verify-token/${token}`,
    verifyAndUpdatePasswordWithToken: (token: string) => `/update-password/${token}`,
    verifyEmailWithToken: (token: string) => `/verify-email/${token}`,
  },
  users: {
    baseUrl: '/user',
    findAll: (query?: UserQueryParams) => `/user?${generateQueryString(query)}`,
    findOneById: (companyId: string, userId: string) => `/users/${userId}?companyId=${companyId}`,
    updateUserById: (companyId: string, userId: string) => `/user/${userId}?companyId=${companyId}`,
    deleteUserById: (companyId: string, userId: string) => `/user/${userId}?companyId=${companyId}`,
  },
  userLikes: {
    baseUrl: '/likes',
    createLike: (kudosId: string) => `/likes/${kudosId}`,
    deleteLike: (kudosId: string) => `/likes/${kudosId}`,
  },
  kudos: {
    baseUrl: '/kudos',
    findAll: (query: KudosQueryParams) => `/kudos?${generateQueryString(query)}`,
    findOneById: (companyId: string, kudosId: string) => `/kudos/${kudosId}?companyId=${companyId}`,
    createKudo: (companyId: string) => `/kudos?companyId=${companyId}`,
    updateKudoById: (companyId: string, kudosId: string) =>
      `/kudos/${kudosId}?companyId=${companyId}`,
    deleteKudoById: (companyId: string, kudosId: string) =>
      `/kudos/${kudosId}?companyId=${companyId}`,
  },
  comments: {
    baseUrl: '/comments',
    findAll: (query?: CommentQueryParams) => `/comments?${generateQueryString(query)}`,
    findOneById: (companyId: string, commentId: string) =>
      `/comments/${commentId}?companyId=${companyId}`,
    createComment: (companyId: string) => `/comments?companyId=${companyId}`,
    updateCommentById: (companyId: string, commentId: string) =>
      `/comments/${commentId}?companyId=${companyId}`,
    deleteCommentById: (companyId: string, commentId: string) =>
      `/comments/${commentId}?companyId=${companyId}`,
  },
  commentLikes: {
    base: '/comment-likes',
    createLike: (commentId: string) => `/comment-likes/${commentId}`,
    deleteLike: (commentId: string) => `/comment-likes/${commentId}`,
  },
  company: {
    baseUrl: '/company',
    findAll: (query?: CompanyQueryParams) => `/company?${generateQueryString(query)}`,
    findOneById: (companyId: string) => `/company/${companyId}`,
    updateCompanyById: (companyId: string) => `/company/${companyId}`,
    // will be added to SUPERADMIN panel
    // createCompany: () => '/company',
    // deleteCompanyById: (companyId: string) => `/company/${companyId}`,
  },
  userNotifications: {
    baseUrl: '/user-notifications',
    findAll: (query?: UserNotificationQueryParams) =>
      `/user-notifications?${generateQueryString(query)}`,
    markAllAsRead: () => `/user-notifications/mark-all-as-read`,
    deleteNotificationById: (notificationId: string) => `/user-notifications/${notificationId}`,
  },
};
