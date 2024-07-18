import axios from 'axios';
import { errorLogout, refreshTokens } from './auth-actions';
import { CustomError, handleApiError } from '@/errors';
import { APIProps } from '@/types';
import { BASE_API_URL, MAX_API_RETRY_REQUESTS } from '@/constants';
import { getAuthTokens } from '@/lib/localStorage';
import { ObjectKeys } from 'node_modules/react-hook-form/dist/types/path/common';

let retries = 0;

export const authClient = axios.create({
  baseURL: `${BASE_API_URL}/auth`,
});
export const apiClient = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

export const verifyClient = axios.create({
  baseURL: `${BASE_API_URL}/verify`,
});

const clients = {
  AUTH: authClient,
  API: apiClient,
  VERIFY: verifyClient,
};

export type HTTPClients = ObjectKeys<typeof clients>;

apiClient.interceptors.request.use((config) => {
  const authTokens = getAuthTokens();
  if (!authTokens || !authTokens.accessToken) {
    return Promise.reject(new CustomError('No auth tokens found', 400));
  }
  config.headers.Authorization = `Bearer ${authTokens.accessToken}`;
  return config;
});

//intercept apiClient response and handles a 401 error. If error exists it will try and refresh the access token using the refresh token
//if no refresh token exists or get's a response status of 401 it will log the user out
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401 && retries < MAX_API_RETRY_REQUESTS) {
        retries++;
        try {
          await refreshTokens();
          retries = 0;
        } catch (refreshError) {
          const customError = new CustomError(
            'Token Refresh Failed',
            (refreshError as any).response ? (refreshError as any).response.status : 500
          );
          errorLogout();
          return Promise.reject(customError);
        }

        const originalRequest = error.config;
        const authTokens = getAuthTokens();
        if (!authTokens || !authTokens.refreshToken) {
          errorLogout();
          throw new CustomError('No auth tokens found', 401);
        }
        originalRequest.headers.Authorization = `Bearer ${authTokens.accessToken}`;
        return apiClient(originalRequest);
      } else {
        const customError = new CustomError(
          error.response.data.message || 'An Error Occured',
          error.response.status
        );
        return Promise.reject(customError);
      }
    } else if (error.request) {
      const customError = new CustomError('No response from server', 500);
      return Promise.reject(customError);
    } else {
      if (error instanceof CustomError) {
        return Promise.reject(error);
      } else {
        const customError = new CustomError('An error occured', 500);
        return Promise.reject(customError);
      }
    }
  }
);

async function fetcher<T, D = any>({ client = 'API', url }: APIProps<D>) {
  try {
    const response = await clients[client].get<T>(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

async function poster<D = any, T = any>({
  client = 'API',
  data,
  url,
  config,
}: APIProps<D>): Promise<T | undefined> {
  try {
    const response = await clients[client].post<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

async function patcher<D = any, T = any>({
  client = 'API',
  url,
  data,
  config,
}: APIProps<D>): Promise<T | undefined> {
  try {
    const response = await clients[client].patch<T>(url, data, config);
    return response.data as T;
  } catch (error) {
    handleApiError(error);
  }
}

async function deleter<D = any, T = any>({
  client = 'API',
  url,
  config,
}: APIProps<D>): Promise<T | undefined> {
  try {
    const response = await clients[client].delete<T>(url, config);
    return response.data as T;
  } catch (error) {
    handleApiError(error);
  }
}

export { fetcher, poster, patcher, deleter };
