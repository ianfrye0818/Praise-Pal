import { z } from 'zod';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Control, FieldPath } from 'react-hook-form';
import { AxiosRequestConfig } from 'axios';
import {
  AddUserSchema,
  SignInSchema,
  SubmitCompanyContactSchema,
  UpdateCompanySchema,
} from '@/zodSchemas';
import { HTTPClients } from '@/api/axios';

export type SignInFormProps = z.infer<typeof SignInSchema>;

export type SignUpFormProps = z.infer<typeof AddUserSchema>;

export type CompanySignUpFormProps = z.infer<typeof SubmitCompanyContactSchema>;
export interface User {
  email: string;
  userId: string;
  companyCode: string;
  role: Role;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type UpdateUserProps = Partial<Omit<User, 'userId'>>;
export type AdminUpdateUserProps = Partial<Omit<User, 'companyCode' | 'userId'>>;

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_OWNER = 'COMPANY_OWNER',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type SidebarLink = {
  label: string;
  route: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
};

export interface TKudos {
  id: string;
  companyCode: string;
  message: string;
  title?: string;
  likes: number;
  isAnonymous: boolean;
  isHidden: boolean;
  sender: User;
  receiver: User;
  kudoLikes: KudoLike[];
  comments?: Comment[];
  createdAt: string;
}

export interface CreateKudoFormProps {
  senderId: string;
  receiverId: string;
  companyCode: string;
  message: string;
  title?: string | null;
  isAnonymous: boolean;
}

export interface CreateCommentFormProps {
  content: string;
  parentId?: string;
  kudosId: string;
  userId: string;
}

export type UpdateKudoProps = Partial<Omit<CreateKudoFormProps, 'senderId' | 'companyCode'>> & {
  id: string;
  isHidden?: boolean;
};

export interface KudoLike {
  kudoId: string;
  userId: string;
}

export interface CommentLike {
  commentId: string;
  userId: string;
}

export interface Company {
  companyCode: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  users: User[];
  kudos: TKudos[];
  createdAt?: EpochTimeStamp;
  updatedAt?: EpochTimeStamp;
  deletedAt?: EpochTimeStamp | null;
}

// export type UpdateCompanyProps = Partial<
//   Omit<Company, 'users' | 'kudos' | 'createdAt' | 'updatedAt' | 'deletedAt'>
// >;

export type UpdateCompanyProps = z.infer<typeof UpdateCompanySchema>;
export interface Comment {
  id: string;
  content: string;
  parentId?: string;
  likes: number;
  user: User;
  kudosId: string;
  createdAt: string;
  comments?: Comment[];
  commentLikes: CommentLike[];
}

export interface UserNotification {
  id: string;
  userId: string;
  actionType: ActionTypes;
  message: string;
  newUserId?: string;
  newUser?: User;
  kudosId?: string;
  commentId?: string;
  comment?: Comment;
  kudos?: TKudos;
  isRead: boolean;
  createdAt: string;
}

interface QueryParams {
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  take?: number;
  sortBy?: 'ASC' | 'DESC';
  skip?: number;
  page?: number;
}

export interface UserQueryParams extends QueryParams {
  userId?: string;
  email?: string;
  companyCode: string;
  firstName?: string;
  lastName?: string;
  roles?: Role | Role[];
  cursor?: any;
}

export interface KudosQueryParams extends QueryParams {
  // kudosId?: string;
  senderId?: string;
  isHidden?: boolean;
  receiverId?: string;
  message?: string;
  title?: string;
  companyCode: string;
  id?: string;
}

export interface CommentQueryParams extends QueryParams {
  commentId?: string;
  kudosId?: string;
  parentId?: string;
  user: User;
  content?: string;
}

export interface CompanyQueryParams extends QueryParams {
  companyCode?: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

export interface UserNotificationQueryParams extends QueryParams {
  id?: string;
  userId?: string;
  isRead?: boolean;
  message?: string;
  actionTypes?: ActionTypes | ActionTypes[];
}

export interface SelectInputProps<T extends z.ZodTypeAny>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  control: Control<z.infer<T>, any>;
  name: FieldPath<z.infer<T>>;
  label?: string;
  placeholder?: string;
  options: SelectInputOption[];
}

type SelectInputOption = {
  label: string;
  value: string;
};

export interface APIProps<D> {
  url: string;
  data?: D;
  config?: AxiosRequestConfig<D>;
  client?: HTTPClients;
}

export enum ActionTypes {
  COMMENT_COMMENT = 'COMMENT_COMMENT',
  COMMENT_LIKE = 'COMMENT_LIKE',
  KUDOS_COMMENT = 'KUDOS_COMMENT',
  KUDOS_LIKE = 'KUDOS_LIKE',
  KUDOS = 'KUDOS',
  NEW_USER = 'NEW_USER',
}

export interface VerifyTokenAndResetPasswordProps {
  message: string;
  status: number;
  payload: {
    fullName: string;
    userId: string;
    email: string;
  };
}

export type TokenType = 'NEW_USER' | 'PASSWORD';
