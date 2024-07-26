import { generateQueryString } from '@/lib/utils';
import {
  CoachingCommentQueryParams,
  CoachingQuestionQueryParams,
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
    findCompanyContacts: (companyCode: string) => `/company/company-contacts/${companyCode}`,
    updateCompanyById: (companyCode: string) => `/company/${companyCode}`,
    requestNewCompany: '/company/request-new-company',
  },
  companyContacts: {
    createContact: '/company-contact',
    convertToUser: (contactId: string) => `/company-contact/convert/${contactId}`,
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
  coachingQuestions: {
    getAllCoachingQuestions: (query: CoachingQuestionQueryParams) =>
      `/coaching-question?${generateQueryString(query)}`,
    getSingleCoachingQuestion: (companyCode: string, questionId: string) =>
      `/coaching-question/${questionId}?companyCode=${companyCode}`,
    createCoachingQuestion: (companyCode: string) =>
      `/coaching-question?companyCode=${companyCode}`,
    updateCoachingQuestion: (companyCode: string, questionId: string) =>
      `/coaching-question/${questionId}?companyCode=${companyCode}`,
    deleteCoachingQuestion: (companyCode: string, questionId: string) =>
      `/coaching-question/${questionId}?companyCode=${companyCode}`,
  },
  coachingComments: {
    getAllCoachingComments: (query: CoachingCommentQueryParams) =>
      `/coaching-comment?${generateQueryString(query)}`,
    getSingleCoachingComment: (companyCode: string, commentId: string) =>
      `/coaching-comment/${commentId}?companyCode=${companyCode}`,
    createCoachingComment: (companyCode: string) => `/coaching-comment?companyCode=${companyCode}`,
    updateCoachingComment: (companyCode: string, commentId: string) =>
      `/coaching-comment/${commentId}?companyCode=${companyCode}`,
    deleteCoachingComment: (companyCode: string, commentId: string) =>
      `/coaching-comment/${commentId}?companyCode=${companyCode}`,
  },
};
