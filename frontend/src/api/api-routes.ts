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
    login: '/login',
    register: '/register',
    refresh: '/refresh',
    logout: '/logout',
    sendResetPasswordEmail: '/reset-password',
  },
  users: {
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
    createLike: (kudosId: string) => `/likes/${kudosId}`,
    deleteLike: (kudosId: string) => `/likes/${kudosId}`,
  },
  kudos: {
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
    findAll: (query?: CompanyQueryParams) => `/company?${generateQueryString(query)}`,
    findOneById: (companyCode: string) => `/company/${companyCode}`,
    updateCompanyById: (companyCode: string) => `/company/${companyCode}`,
    requestNewCompany: '/company/request-new-company',
  },
  companyContacts: {
    createContact: '/company-contact',
    getContacts: (companyCode: string) => `/company-contact?companyCode=${companyCode}`,
    updateContact: (contactId: string) => `/company-contact/${contactId}`,
    deleteContact: (contactId: string) => `/company-contact/${contactId}`,
  },
  userNotifications: {
    findAll: (query?: UserNotificationQueryParams) =>
      `/user-notifications?${generateQueryString(query)}`,
    markAllAsRead: () => `/user-notifications/mark-all-as-read`,
    markSingleAsRead: (notificationId: string) =>
      `/user-notifications/${notificationId}/mark-as-read`,
    deleteNotificationById: (notificationId: string) => `/user-notifications/${notificationId}`,
  },
  verify: {
    verifyAndUpdatePasswordWithToken: (token: string) => `/update-password/${token}`,
  },
  errors: {
    getAllErrorLogs: '/errors/logs',
    getErrorLogById: (errorId: string) => `/errors/logs/${errorId}`,
    createErrorLog: '/errors/logs',
    deleteErrorLogById: (errorId: string) => `/errors/logs/${errorId}`,
  },
};
