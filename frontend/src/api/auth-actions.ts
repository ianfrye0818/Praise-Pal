import { SignInFormProps, SignUpFormProps, UpdateUserProps } from '@/types';
import { Dispatch } from 'react';
import { ActionType, AuthAction } from '@/providers/AuthReducerProvider';
import {
  patchUpdateUser,
  postLogout,
  postRefreshTokens,
  postRegisterUser,
  postLoginUser,
} from './api-handlers';
import {
  getAuthTokens,
  removeAuthTokens,
  removeUserToken,
  setAuthTokens,
  setUserToken,
} from '@/lib/localStorage';
import { CustomError } from '@/errors';

const AuthActions = {
  login: async (signInPayload: SignInFormProps) => {
    {
      return await postLoginUser(signInPayload);
    }
  },
  register: async (signUpPaylaod: SignUpFormProps) => {
    return await postRegisterUser(signUpPaylaod);
  },
  update: async (companyCode: string, userId: string, updateUserPayload: UpdateUserProps) => {
    return await patchUpdateUser(companyCode, userId, updateUserPayload);
  },
  logout: async () => {
    const authTokens = getAuthTokens();
    if (!authTokens || !authTokens.refreshToken) throw new Error('No refresh token found');
    await postLogout(authTokens.refreshToken);
  },
  refreshTokens: async () => {
    const authTokens = getAuthTokens();
    if (!authTokens || !authTokens.refreshToken) {
      errorLogout();
      throw new CustomError('No auth tokens found', 401);
    }
    setAuthTokens(await postRefreshTokens(authTokens.refreshToken));
  },
};

export const login = async (dispatch: Dispatch<AuthAction>, signInPayload: SignInFormProps) => {
  dispatch({ type: ActionType.LOGIN_REQUEST });
  try {
    const data = await AuthActions.login(signInPayload);
    if (!data) throw new Error('Invalid credentials');
    const { accessToken, refreshToken, ...user } = data;
    setAuthTokens({ accessToken, refreshToken });
    setUserToken(user);
    dispatch({
      type: ActionType.LOGIN_SUCCESS,
      payload: { user },
    });
  } catch (error) {
    dispatch({ type: ActionType.LOGIN_FAILURE });
    console.error(error);
    throw error;
  }
};

export const register = async (signUpPayload: SignUpFormProps) => {
  try {
    const data = await AuthActions.register(signUpPayload);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const logout = async (dispatch: Dispatch<AuthAction>) => {
  dispatch({ type: ActionType.LOGOUT_REQUEST });
  try {
    await AuthActions.logout();
    removeAuthTokens();
    removeUserToken();
    dispatch({ type: ActionType.LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: ActionType.LOGOUT_FAILURE });
  }
};

export async function updateCurrentUser({
  companyCode,
  currentUserId,
  dispatch,
  payload,
}: {
  dispatch: Dispatch<AuthAction>;
  currentUserId: string;
  companyCode: string;
  payload: UpdateUserProps;
}) {
  dispatch({ type: ActionType.UPDATE_REQUEST });
  try {
    const data = await AuthActions.update(companyCode, currentUserId, payload);
    if (!data) throw new Error('Error updating user');
    dispatch({
      type: ActionType.UPDATE_SUCCESS,
      payload: { user: data },
    });
    setUserToken(data);
  } catch (error) {
    dispatch({ type: ActionType.UPDATE_FAILURE });
  }
}

export async function errorLogout() {
  const refreshToken = getAuthTokens()?.refreshToken;
  if (refreshToken) {
    await postLogout(refreshToken);
  }
  localStorage.clear();
  sessionStorage.clear();
  window.location.pathname !== '/sign-in' && window.location.replace('/sign-in');
}

export async function refreshTokens() {
  try {
    await AuthActions.refreshTokens();
  } catch (error) {
    console.error('Error refreshing tokens', error);
    errorLogout();
  }
}
