import {
  SignInFormProps,
  User,
  AuthTokens,
  SignUpFormProps,
  TKudos,
  CreateKudoFormProps,
  Company,
  UpdateCompanyProps,
  UpdateKudoProps,
  KudosQueryParams,
  CreateCommentFormProps,
  UserQueryParams,
  UserNotification,
  UserNotificationQueryParams,
  VerifyTokenAndResetPasswordProps,
  CompanySignUpFormProps,
  ErrorLogFormProps,
  ErrorLog,
  CoachingQuestionQueryParams,
  CoachingQuestion,
  CoachingCommentQueryParams,
} from '@/types';
import { ApiRoutes } from './api-routes';
import { AxiosClientsHandlers } from './axios';
import { createRefreshHeader } from '@/lib/utils';
import { CleanedData } from '@/hooks/api/useCompany/useRequestNewCompany';
import {
  AddCoachingCommentProps,
  AddCoachingQuestionProps,
  UpdateCoachingQuestionProps,
} from '@/zodSchemas';

//auth actions
export const postLoginUser = async (payload: SignInFormProps) =>
  await AxiosClientsHandlers.poster<SignInFormProps, User & AuthTokens>({
    client: 'AUTH',
    url: ApiRoutes.auth.login,
    data: payload,
  });

export const postRegisterUser = async (payload: SignUpFormProps) =>
  await AxiosClientsHandlers.poster<
    SignUpFormProps,
    { message: string; status: number; email: string }
  >({
    client: 'AUTH',
    url: ApiRoutes.auth.register,
    data: payload,
  });

export const postRefreshTokens = async (refreshToken: string) =>
  await AxiosClientsHandlers.poster<any, AuthTokens>({
    client: 'AUTH',
    url: ApiRoutes.auth.refresh,
    config: { headers: createRefreshHeader(refreshToken) },
  });

export const postLogout = async (refreshToken: string) =>
  await AxiosClientsHandlers.poster<any, void>({
    client: 'AUTH',
    url: ApiRoutes.auth.logout,
    config: { headers: createRefreshHeader(refreshToken) },
  });

export const postSendResetPasswordEmail = async (email: string) =>
  await AxiosClientsHandlers.poster<{ email: string }, VerifyTokenAndResetPasswordProps>({
    client: 'AUTH',
    url: ApiRoutes.auth.sendResetPasswordEmail,
    data: { email },
  });

//verify actions
export const postVerifyUser = async (companyCode: string, userId: string) =>
  await AxiosClientsHandlers.poster<void, void>({
    url: ApiRoutes.users.verifyUser(companyCode, userId),
  });

export const postVerifyAndUpdatePasswordWithToken = async (token: string, password: string) =>
  await AxiosClientsHandlers.poster<{ password: string }, VerifyTokenAndResetPasswordProps>({
    url: ApiRoutes.verify.verifyAndUpdatePasswordWithToken(token),
    data: { password },
    client: 'API',
  });

//users actions
export const getAllUsers = async (queryParams: UserQueryParams) =>
  await AxiosClientsHandlers.getter<User[]>({ url: ApiRoutes.users.findAll(queryParams) });

export const getCompanyUsers = async (query: UserQueryParams) => {
  const { companyCode, ...rest } = query;
  const users = await AxiosClientsHandlers.getter<User[]>({
    url: ApiRoutes.users.findAllByCompany(companyCode, rest),
  });
  return users;
};

export const getSingleCompanyUser = async (companyCode: string, userId: string) =>
  await AxiosClientsHandlers.getter<User>({
    url: ApiRoutes.users.findOneById(companyCode, userId),
  });

export const postCreateUser = async (payload: SignUpFormProps) => {
  return await AxiosClientsHandlers.poster<SignUpFormProps, User>({
    url: ApiRoutes.users.createUser(payload.companyCode),
    data: payload,
  });
};

export const patchUpdateUser = async (
  companyCode: string,
  userId: string,
  payload: Partial<User>
) => {
  return await AxiosClientsHandlers.patcher<Partial<User>, User>({
    url: ApiRoutes.users.updateUserById(companyCode, userId),
    data: payload,
  });
};

export const patchRestoreUser = async (companyCode: string, userId: string) => {
  return await AxiosClientsHandlers.patcher<void, void>({
    url: ApiRoutes.users.restoreUserById(companyCode, userId),
  });
};

export const deleteSingleUser = async (companyCode: string, userId: string) =>
  await AxiosClientsHandlers.deleter<void>({
    url: ApiRoutes.users.deleteUserById(companyCode, userId),
  });

//kudos actions`
export const getCompanyKudos = async (queryPrams: KudosQueryParams) => {
  const url = ApiRoutes.kudos.findAll(queryPrams);
  return await AxiosClientsHandlers.getter<TKudos[]>({ url });
};

export const getsingleKudo = async (companyCode: string, kudoId: string) => {
  return await AxiosClientsHandlers.getter<TKudos>({
    url: ApiRoutes.kudos.findOneById(companyCode, kudoId),
  });
};

export const postCreateKudo = async (payload: CreateKudoFormProps) =>
  await AxiosClientsHandlers.poster<CreateKudoFormProps, void>({
    url: ApiRoutes.kudos.createKudo(payload.companyCode),
    data: payload,
  });

export const patchUpdateKudo = async (companyCode: string, payload: UpdateKudoProps) =>
  await AxiosClientsHandlers.patcher<UpdateKudoProps, void>({
    url: ApiRoutes.kudos.updateKudoById(companyCode, payload.id),
    data: payload,
  });

export const deleteSingleKudo = async (companyCode: string, kudoId: string) =>
  await AxiosClientsHandlers.deleter<void>({
    url: ApiRoutes.kudos.deleteKudoById(companyCode, kudoId),
  });

//likes actions
export const postAddLikeKudo = async (kudoId: string) =>
  await AxiosClientsHandlers.poster<void, void>({ url: ApiRoutes.kudoLikes.createLike(kudoId) });

export const deleteRemoveLikeKudo = async (kudoId: string) =>
  await AxiosClientsHandlers.deleter<void>({ url: ApiRoutes.kudoLikes.deleteLike(kudoId) });

//company actions
export const getCompany = async (companyCode: string) =>
  await AxiosClientsHandlers.getter<Company>({ url: ApiRoutes.company.findOneById(companyCode) });

export const getComapnyContacts = async (companyCode: string) => {
  return await AxiosClientsHandlers.getter({
    url: ApiRoutes.company.findCompanyContacts(companyCode),
  });
};

export const patchUpdateCompany = async (payload: UpdateCompanyProps) =>
  await AxiosClientsHandlers.patcher<UpdateCompanyProps, void>({
    url: ApiRoutes.company.updateCompanyById(payload.companyCode as string),
    data: payload,
  });

export const postNewCompanyRequest = async (payload: CleanedData) => {
  return await AxiosClientsHandlers.poster<CleanedData, Company>({
    url: ApiRoutes.company.requestNewCompany,
    data: payload,
    client: 'API',
  });
};

//companyContacts actions
export const postAddCompanyContact = async (payload: CompanySignUpFormProps) =>
  await AxiosClientsHandlers.poster<CompanySignUpFormProps, Company>({
    url: ApiRoutes.company.requestNewCompany,
    data: payload,
    client: 'API',
  });

//notifications actions
export const getUserNotifications = async (queryParams?: UserNotificationQueryParams) => {
  return await AxiosClientsHandlers.getter<UserNotification[]>({
    url: ApiRoutes.userNotifications.findAll(queryParams),
  });
};

export const patchMarkSingleNotificationAsRead = async (notificationId: string) => {
  await AxiosClientsHandlers.patcher<void, void>({
    url: ApiRoutes.userNotifications.markSingleAsRead(notificationId),
  });
};

export const patchMarkAllNotificationAsRead = async () => {
  await AxiosClientsHandlers.patcher<void, void>({
    url: ApiRoutes.userNotifications.markAllAsRead(),
  });
};

export const deleteNotificationById = async (notificationId: string) => {
  await AxiosClientsHandlers.deleter<void>({
    url: ApiRoutes.userNotifications.deleteNotificationById(notificationId),
  });
};

//comments like actions
export const postAddLikeComment = async (commentId: string) => {
  await AxiosClientsHandlers.poster<void, void>({
    url: ApiRoutes.commentLikes.createLike(commentId),
  });
};

export const deleteLikeComment = async (commentId: string) => {
  await AxiosClientsHandlers.deleter<void>({ url: ApiRoutes.commentLikes.deleteLike(commentId) });
};

//comment actions
export const postCreateComment = async (companyCode: string, payload: CreateCommentFormProps) => {
  await AxiosClientsHandlers.poster<CreateCommentFormProps, void>({
    url: ApiRoutes.comments.createComment(companyCode),
    data: payload,
  });
};

export const deleteComment = async (companyCode: string, commentId: string) => {
  await AxiosClientsHandlers.deleter<void>({
    url: ApiRoutes.comments.deleteCommentById(companyCode, commentId),
  });
};

export const patchUpdateComment = async (
  companyCode: string,
  commentId: string,
  content: string
) => {
  await AxiosClientsHandlers.patcher<Partial<CreateCommentFormProps>, void>({
    url: ApiRoutes.comments.updateCommentById(companyCode, commentId),
    data: { content },
  });
};

//error Logging
export const createErrorLog = async (error: ErrorLogFormProps) =>
  await AxiosClientsHandlers.poster<ErrorLogFormProps, void>({
    url: ApiRoutes.errors.createErrorLog,
    data: error,
    client: 'API',
  });

export const getErrorLogById = async (errorId: string) =>
  await AxiosClientsHandlers.getter<ErrorLog>({ url: ApiRoutes.errors.getErrorLogById(errorId) });

export const getAllErrorLogs = async () =>
  await AxiosClientsHandlers.getter<ErrorLog[]>({ url: ApiRoutes.errors.getAllErrorLogs });

export const deleteErrorById = async (errorId: string) =>
  await AxiosClientsHandlers.deleter<void>({ url: ApiRoutes.errors.deleteErrorLogById(errorId) });

//Coaching Corner
//Coaching Questions
export const getAllCoachingQuestions = async (query: CoachingQuestionQueryParams) => {
  return await AxiosClientsHandlers.getter<CoachingQuestion[]>({
    url: ApiRoutes.coachingQuestions.getAllCoachingQuestions(query),
  });
};

export const getSingleCoachingQuestion = async (companyCode: string, questionId: string) => {
  return await AxiosClientsHandlers.getter<CoachingQuestion>({
    url: ApiRoutes.coachingQuestions.getSingleCoachingQuestion(companyCode, questionId),
  });
};

export const postCreateCoachingQuestion = async (
  companyCode: string,
  payload: AddCoachingQuestionProps
) => {
  return await AxiosClientsHandlers.poster<any, CoachingQuestion>({
    url: ApiRoutes.coachingQuestions.createCoachingQuestion(companyCode),
    data: payload,
  });
};

export const patchUpdateCoachingQuestion = async (
  companyCode: string,
  questionId: string,
  payload: UpdateCoachingQuestionProps
) => {
  return await AxiosClientsHandlers.patcher<any, CoachingQuestion>({
    url: ApiRoutes.coachingQuestions.updateCoachingQuestion(companyCode, questionId),
    data: payload,
  });
};

export const deleteCoachingQuestionByID = async (companyCode: string, questionId: string) => {
  return await AxiosClientsHandlers.deleter<void>({
    url: ApiRoutes.coachingQuestions.deleteCoachingQuestion(companyCode, questionId),
  });
};

//Coaching Comments
export const getAllCoachingComments = async (query: CoachingCommentQueryParams) => {
  return await AxiosClientsHandlers.getter<CoachingQuestion[]>({
    url: ApiRoutes.coachingComments.getAllCoachingComments(query),
  });
};

export const getSingleCoachingComment = async (companyCode: string, commentId: string) => {
  return await AxiosClientsHandlers.getter<CoachingQuestion>({
    url: ApiRoutes.coachingComments.getSingleCoachingComment(companyCode, commentId),
  });
};

export const postCreateCoachingComment = async (
  companyCode: string,
  payload: AddCoachingCommentProps
) => {
  return await AxiosClientsHandlers.poster<any, CoachingQuestion>({
    url: ApiRoutes.coachingComments.createCoachingComment(companyCode),
    data: payload,
  });
};

export const patchUpdateCoachingComment = async (
  companyCode: string,
  commentId: string,
  payload: UpdateCoachingQuestionProps
) => {
  return await AxiosClientsHandlers.patcher<any, CoachingQuestion>({
    url: ApiRoutes.coachingComments.updateCoachingComment(companyCode, commentId),
    data: payload,
  });
};

export const deleteCoachingCommentById = async (companyCode: string, commentId: string) => {
  return await AxiosClientsHandlers.deleter<void>({
    url: ApiRoutes.coachingComments.deleteCoachingComment(companyCode, commentId),
  });
};
