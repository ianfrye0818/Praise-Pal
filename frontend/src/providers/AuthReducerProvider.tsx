import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Role, User } from '@/types';
import { refreshTokens } from '@/api/auth-actions';
import { getUserToken } from '@/lib/localStorage';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCompanyOwner: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  isCompanyOwner: false,
};

// Define action types
enum ActionType {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT_REQUEST = 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE = 'LOGOUT_FAILURE',
  UPDATE_REQUEST = 'UPDATE_REQUEST',
  UPDATE_SUCCESS = 'UPDATE_SUCCESS',
  UPDATE_FAILURE = 'UPDATE_FAILURE',
}

//Action types
interface LoginRequestAction {
  type: ActionType.LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: ActionType.LOGIN_SUCCESS;
  payload: { user: User };
}

interface LoginFailureAction {
  type: ActionType.LOGIN_FAILURE;
}

interface LogoutRequestAction {
  type: ActionType.LOGOUT_REQUEST;
}

interface LogoutSuccessAction {
  type: ActionType.LOGOUT_SUCCESS;
}

interface LogoutFailureAction {
  type: ActionType.LOGOUT_FAILURE;
}

interface UpdateRequestAction {
  type: ActionType.UPDATE_REQUEST;
}

interface UpdateSuccessAction {
  type: ActionType.UPDATE_SUCCESS;
  payload: { user: User };
}

interface UpdateFailureAction {
  type: ActionType.UPDATE_FAILURE;
}

// Define action creators
export type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutRequestAction
  | LogoutSuccessAction
  | LogoutFailureAction
  | UpdateRequestAction
  | UpdateSuccessAction
  | UpdateFailureAction;

// Create the reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case ActionType.LOGIN_REQUEST:
    case ActionType.LOGOUT_REQUEST:
    case ActionType.UPDATE_REQUEST:
      return { ...state, loading: true };
    case ActionType.LOGIN_SUCCESS:
    case ActionType.UPDATE_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isAdmin:
          action.payload.user.role === Role.ADMIN ||
          action.payload.user.role === Role.SUPER_ADMIN ||
          action.payload.user.role === Role.COMPANY_OWNER,
        loading: false,
        isCompanyOwner: action.payload.user.role === Role.COMPANY_OWNER,
      };
    case ActionType.LOGIN_FAILURE:
    case ActionType.UPDATE_FAILURE:
      return { ...state, loading: false, isAuthenticated: false, user: null, isAdmin: false };
    case ActionType.LOGOUT_SUCCESS:
      return { ...state, user: null, isAuthenticated: false, isAdmin: false, loading: false };
    case ActionType.LOGOUT_FAILURE: {
      return { ...state, loading: false };
    }
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const setUpLoggedInUser = async () => {
      try {
        dispatch({ type: ActionType.LOGIN_REQUEST });
        const storedUser = getUserToken();
        if (storedUser) {
          await refreshTokens();
          dispatch({ type: ActionType.LOGIN_SUCCESS, payload: { user: storedUser } });
        }
      } catch (error) {
        dispatch({ type: ActionType.LOGIN_FAILURE });
      }
    };
    setUpLoggedInUser();
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext, ActionType };
