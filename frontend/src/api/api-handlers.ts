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
} from '@/types';
import { ApiRoutes } from './api-routes';
import { deleter, fetcher, patcher, poster } from './axios';
import { createRefreshHeader } from '@/lib/utils';

//auth actions
export const postLoginUser = async (payload: SignInFormProps) =>
  await poster<SignInFormProps, User & AuthTokens>({
    client: 'AUTH',
    url: ApiRoutes.auth.login,
    data: payload,
  });

export const postRegisterUser = async (payload: SignUpFormProps) =>
  await poster<SignUpFormProps, { message: string; status: number; email: string }>({
    client: 'AUTH',
    url: ApiRoutes.auth.register,
    data: payload,
  });

export const postRefreshTokens = async (refreshToken: string) =>
  await poster<any, AuthTokens>({
    client: 'AUTH',
    url: ApiRoutes.auth.refresh,
    config: { headers: createRefreshHeader(refreshToken) },
  });

export const postLogout = async (refreshToken: string) =>
  await poster<any, void>({
    client: 'AUTH',
    url: ApiRoutes.auth.logout,
    config: { headers: createRefreshHeader(refreshToken) },
  });

export const postSendResetPasswordEmail = async (email: string) =>
  await poster<{ email: string }, VerifyTokenAndResetPasswordProps>({
    client: 'AUTH',
    url: ApiRoutes.auth.sendResetPasswordEmail,
    data: { email },
  });

//verify actions
export const postVerifyUser = async (companyCode: string, userId: string) =>
  await poster<void, void>({
    url: ApiRoutes.users.verifyUser(companyCode, userId),
  });

export const postVerifyAndUpdatePasswordWithToken = async (token: string, password: string) =>
  await poster<{ password: string }, VerifyTokenAndResetPasswordProps>({
    url: ApiRoutes.verify.verifyAndUpdatePasswordWithToken(token),
    data: { password },
    client: 'VERIFY',
  });

//users actions
export const getAllUsers = async (queryParams: UserQueryParams) =>
  await fetcher<User[]>({ url: ApiRoutes.users.findAll(queryParams) });

export const getCompanyUsers = async (query: UserQueryParams) => {
  const { companyCode, ...rest } = query;
  const users = await fetcher<User[]>({
    url: ApiRoutes.users.findAllByCompany(companyCode, rest),
  });
  return users;
};

export const getSingleCompanyUser = async (companyCode: string, userId: string) =>
  await fetcher<User>({ url: ApiRoutes.users.findOneById(companyCode, userId) });

export const postCreateUser = async (payload: SignUpFormProps) => {
  return await poster<SignUpFormProps, User>({
    url: ApiRoutes.users.createUser(payload.companyCode),
    data: payload,
  });
};

export const patchUpdateUser = async (
  companyCode: string,
  userId: string,
  payload: Partial<User>
) => {
  return await patcher<Partial<User>, User>({
    url: ApiRoutes.users.updateUserById(companyCode, userId),
    data: payload,
  });
};

export const patchRestoreUser = async (companyCode: string, userId: string) => {
  return await patcher<void, void>({
    url: ApiRoutes.users.restoreUserById(companyCode, userId),
  });
};

export const deleteSingleUser = async (companyCode: string, userId: string) =>
  await deleter<void>({ url: ApiRoutes.users.deleteUserById(companyCode, userId) });

//kudos actions`
export const getCompanyKudos = async (queryPrams: KudosQueryParams) => {
  const url = ApiRoutes.kudos.findAll(queryPrams);
  return await fetcher<TKudos[]>({ url });
};

export const getsingleKudo = async (companyCode: string, kudoId: string) => {
  return await fetcher<TKudos>({ url: ApiRoutes.kudos.findOneById(companyCode, kudoId) });
};

export const postCreateKudo = async (payload: CreateKudoFormProps) =>
  await poster<CreateKudoFormProps, void>({
    url: ApiRoutes.kudos.createKudo(payload.companyCode),
    data: payload,
  });

export const patchUpdateKudo = async (companyCode: string, payload: UpdateKudoProps) =>
  await patcher<UpdateKudoProps, void>({
    url: ApiRoutes.kudos.updateKudoById(companyCode, payload.id),
    data: payload,
  });

export const deleteSingleKudo = async (companyCode: string, kudoId: string) =>
  await deleter<void>({ url: ApiRoutes.kudos.deleteKudoById(companyCode, kudoId) });

//likes actions
export const postAddLikeKudo = async (kudoId: string) =>
  await poster<void, void>({ url: ApiRoutes.kudoLikes.createLike(kudoId) });

export const deleteRemoveLikeKudo = async (kudoId: string) =>
  await deleter<void>({ url: ApiRoutes.kudoLikes.deleteLike(kudoId) });

//company actions
export const getCompany = async (companyCode: string) =>
  await fetcher<Company>({ url: ApiRoutes.company.findOneById(companyCode) });

export const patchUpdateCompany = async (payload: UpdateCompanyProps) =>
  await patcher<UpdateCompanyProps, void>({
    url: ApiRoutes.company.updateCompanyById(payload.companyCode as string),
    data: payload,
  });

//notifications actions
export const getUserNotifications = async (queryParams?: UserNotificationQueryParams) => {
  return await fetcher<UserNotification[]>({
    url: ApiRoutes.userNotifications.findAll(queryParams),
  });
};

export const patchMarkSingleNotificationAsRead = async (notificationId: string) => {
  await patcher<void, void>({ url: ApiRoutes.userNotifications.markSingleAsRead(notificationId) });
};

export const patchMarkAllNotificationAsRead = async () => {
  await patcher<void, void>({ url: ApiRoutes.userNotifications.markAllAsRead() });
};

export const deleteNotificationById = async (notificationId: string) => {
  await deleter<void>({ url: ApiRoutes.userNotifications.deleteNotificationById(notificationId) });
};

//comments like actions
export const postAddLikeComment = async (commentId: string) => {
  await poster<void, void>({ url: ApiRoutes.commentLikes.createLike(commentId) });
};

export const deleteLikeComment = async (commentId: string) => {
  await deleter<void>({ url: ApiRoutes.commentLikes.deleteLike(commentId) });
};

//comment actions
export const postCreateComment = async (companyCode: string, payload: CreateCommentFormProps) => {
  await poster<CreateCommentFormProps, void>({
    url: ApiRoutes.comments.createComment(companyCode),
    data: payload,
  });
};

export const deleteComment = async (companyCode: string, commentId: string) => {
  await deleter<void>({ url: ApiRoutes.comments.deleteCommentById(companyCode, commentId) });
};

export const patchUpdateComment = async (
  companyCode: string,
  commentId: string,
  content: string
) => {
  await patcher<Partial<CreateCommentFormProps>, void>({
    url: ApiRoutes.comments.updateCommentById(companyCode, commentId),
    data: { content },
  });
};
