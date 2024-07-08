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
  await poster<SignUpFormProps, User & AuthTokens>({
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

export const getVerifyToken = async (token: string) =>
  await fetcher<VerifyTokenAndResetPasswordProps>({
    client: 'AUTH',
    url: ApiRoutes.auth.verifyToken(token),
  });

export const postSendResetPasswordEmail = async (email: string) =>
  await poster<{ email: string }, VerifyTokenAndResetPasswordProps>({
    client: 'AUTH',
    url: ApiRoutes.auth.sendResetPasswordEmail,
    data: { email },
  });

export const postSendVerifyEmail = async (email: string) =>
  await poster<{ email: string }, VerifyTokenAndResetPasswordProps>({
    client: 'AUTH',
    url: ApiRoutes.auth.sendVerifyEmailEmail,
    data: { email },
  });

export const postVerifyAndUpdatePasswordWithToken = async (token: string, password: string) =>
  poster<{ password: string }, VerifyTokenAndResetPasswordProps>({
    client: 'AUTH',
    url: ApiRoutes.auth.verifyAndUpdatePasswordWithToken(token),
    data: { password },
  });

export const postVerifyEmailWithToken = async (token: string) =>
  await poster<{ token: string }, VerifyTokenAndResetPasswordProps>({
    client: 'AUTH',
    url: ApiRoutes.auth.verifyEmailWithToken(token),
    data: { token },
  });

//users actions
export const getCompanyUsers = async (queryParams: UserQueryParams) =>
  await fetcher<User[]>({ url: ApiRoutes.users.findAll(queryParams) });

export const getSingleCompanyUser = async (companyId: string, userId: string) =>
  await fetcher<User>({ url: ApiRoutes.users.findOneById(companyId, userId) });

export const patchUpdateUser = async (
  companyId: string,
  userId: string,
  payload: Partial<User>
) => {
  return await patcher<Partial<User>, User>({
    url: ApiRoutes.users.updateUserById(companyId, userId),
    data: payload,
  });
};

export const deleteSingleUser = async (companyId: string, userId: string) =>
  await deleter<void>({ url: ApiRoutes.users.deleteUserById(companyId, userId) });

//kudos actions`
export const getCompanyKudos = async (queryPrams: KudosQueryParams) => {
  const url = ApiRoutes.kudos.findAll(queryPrams);
  return await fetcher<TKudos[]>({ url });
};

export const getsingleKudo = async (companyId: string, kudoId: string) =>
  await fetcher<TKudos>({ url: ApiRoutes.kudos.findOneById(companyId, kudoId) });

export const postCreateKudo = async (payload: CreateKudoFormProps) =>
  await poster<CreateKudoFormProps, void>({
    url: ApiRoutes.kudos.createKudo(payload.companyId),
    data: payload,
  });

export const patchUpdateKudo = async (companyId: string, payload: UpdateKudoProps) =>
  await patcher<UpdateKudoProps, void>({
    url: ApiRoutes.kudos.updateKudoById(companyId, payload.id),
    data: payload,
  });

export const deleteSingleKudo = async (companyId: string, kudoId: string) =>
  await deleter<void>({ url: ApiRoutes.kudos.deleteKudoById(companyId, kudoId) });

//likes actions
export const postAddLikeKudo = async (kudoId: string) =>
  await poster<void, void>({ url: ApiRoutes.userLikes.createLike(kudoId) });

export const deleteRemoveLikeKudo = async (kudoId: string) =>
  await deleter<void>({ url: ApiRoutes.userLikes.deleteLike(kudoId) });

//company actions
export const getCompany = async (companyId: string) =>
  await fetcher<Company>({ url: ApiRoutes.company.findOneById(companyId) });

export const patchUpdateCompany = async (payload: UpdateCompanyProps) =>
  await patcher<UpdateCompanyProps, void>({
    url: ApiRoutes.company.updateCompanyById(payload.id as string),
    data: payload,
  });

//notifications actions
export const getUserNotifications = async (queryParams?: UserNotificationQueryParams) => {
  return await fetcher<UserNotification[]>({
    url: ApiRoutes.userNotifications.findAll(queryParams),
  });
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
export const postCreateComment = async (companyId: string, payload: CreateCommentFormProps) => {
  await poster<CreateCommentFormProps, void>({
    url: ApiRoutes.comments.createComment(companyId),
    data: payload,
  });
};

export const deleteComment = async (companyId: string, commentId: string) => {
  await deleter<void>({ url: ApiRoutes.comments.deleteCommentById(companyId, commentId) });
};

export const patchUpdateComment = async (companyId: string, commentId: string, content: string) => {
  await patcher<Partial<CreateCommentFormProps>, void>({
    url: ApiRoutes.comments.updateCommentById(companyId, commentId),
    data: { content },
  });
};

// export const postCreateKudo = async (payload: CreateKudoFormProps) =>
//   await poster<CreateKudoFormProps, void>({
//     url: ApiRoutes.kudos.createKudo(payload.companyId),
//     data: payload,
//   });
