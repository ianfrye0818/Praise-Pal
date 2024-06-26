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
  UserQueryParams,
  UserNotification,
  UserNotificationQueryParams,
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

//users actions
export const getCompanyUsers = async (queryParams: UserQueryParams) =>
  await fetcher<User[]>({ url: ApiRoutes.users.findAll(queryParams) });

export const getSingleCompanyUser = async (companyId: string, userId: string) =>
  await fetcher<User>({ url: ApiRoutes.users.findOneById(companyId, userId) });

export const patchUpdateUser = async (companyId: string, userId: string, payload: Partial<User>) =>
  await patcher<Partial<User>, User>({
    url: ApiRoutes.users.updateUserById(companyId, userId),
    data: payload,
  });

export const deleteSingleUser = async (companyId: string, userId: string) =>
  await deleter<void>({ url: ApiRoutes.users.deleteUserById(companyId, userId) });

//kudos actions`
export const getCompanyKudos = async (queryPrams: KudosQueryParams) =>
  await fetcher<TKudos[]>({ url: ApiRoutes.kudos.findAll(queryPrams) });

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

export const patchMarkNotificationAsRead = async (notificationId: string) => {
  await patcher<void, void>({ url: ApiRoutes.userNotifications.markAsRead(notificationId) });
};

export const deleteNotificationById = async (notificationId: string) => {
  await deleter<void>({ url: ApiRoutes.userNotifications.deleteNotificationById(notificationId) });
};
