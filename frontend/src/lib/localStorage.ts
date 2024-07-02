import { AuthTokens, User } from '@/types';
import { isObjEmpty } from './utils';

export function getAuthTokens(): AuthTokens | null {
  const authTokens = JSON.parse(localStorage.getItem('auth') || '{}');

  if (isObjEmpty(authTokens)) {
    return null;
  }
  return authTokens;
}

export function setAuthTokens(tokens?: AuthTokens) {
  localStorage.setItem('auth', JSON.stringify(tokens));
}

export const removeAuthTokens = () => {
  localStorage.removeItem('auth');
};

export const setUserToken = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUserToken = () => {
  localStorage.removeItem('user');
};

export const getUserToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (isObjEmpty(user)) {
    return null;
  }
  return user as User;
};

export function setErrorMessage(message: string) {
  localStorage.setItem('error', message);
}
export function removeErrorMessage() {
  localStorage.removeItem('error');
}
export function getErrorMessage() {
  const errorMessage = localStorage.getItem('error');
  if (errorMessage) {
    return errorMessage;
  }
  return null;
}
