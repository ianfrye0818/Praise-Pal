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
  setErrorMessage,
  setUserToken,
} from '@/lib/localStorage';

const AuthActions = {
  login: async (signInPayload: SignInFormProps) => {
    return await postLoginUser(signInPayload);
  },
  register: async (signUpPaylaod: SignUpFormProps) => {
    return await postRegisterUser(signUpPaylaod);
  },
  update: async (companyId: string, userId: string, updateUserPayload: UpdateUserProps) => {
    return await patchUpdateUser(companyId, userId, updateUserPayload);
  },
  logout: async () => {
    const { refreshToken } = getAuthTokens();
    if (!refreshToken) throw new Error('No refresh token found');
    await postLogout(refreshToken);
  },
  refreshTokens: async () => {
    const { refreshToken } = getAuthTokens();
    if (!refreshToken) throw new Error('No refresh token found');
    setAuthTokens(await postRefreshTokens(refreshToken));
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

export const register = async (dispatch: Dispatch<AuthAction>, signUpPayload: SignUpFormProps) => {
  dispatch({ type: ActionType.REGISTER_REQUEST });
  try {
    const data = await AuthActions.register(signUpPayload);
    if (!data) throw new Error('Error registering user');
    const { accessToken, refreshToken, ...user } = data;
    setAuthTokens({ accessToken, refreshToken });
    setUserToken(user);
    dispatch({
      type: ActionType.REGISTER_SUCCESS,
      payload: { user },
    });
  } catch (error) {
    dispatch({ type: ActionType.REGISTER_FAILURE });
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

export async function updateCurrentUser(
  dispatch: Dispatch<AuthAction>,
  companyId: string,
  userId: string,
  updateUserPayload: UpdateUserProps
) {
  dispatch({ type: ActionType.UPDATE_REQUEST });
  try {
    const data = await AuthActions.update(companyId, userId, updateUserPayload);
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

export function errorLogout(errorMessage?: string) {
  setErrorMessage(errorMessage || 'Session expired. Please sign in again.');
  removeAuthTokens();
  removeUserToken();
  window.location.pathname !== '/sign-in' && window.location.replace('/sign-in');
}

export async function refreshTokens() {
  try {
    await AuthActions.refreshTokens();
  } catch (error) {
    console.error('Error refreshing tokens', error);
  }
}
