import { z } from 'zod';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Control, FieldPath } from 'react-hook-form';
import { AxiosRequestConfig } from 'axios';

export interface SignInFormProps {
  email: string;
  password: string;
}

export interface SignUpFormProps extends SignInFormProps {
  confirmPassword: string;
  displayName: string;
  companyCode: string;
}

export interface EditKudosDialogProps {
  kudo: TKudos;
  className?: string;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface User {
  email: string;
  userId: string;
  companyId: string;
  role: Role;
  displayName: string;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
}

export type UpdateUserProps = Partial<Omit<User, 'companyId' | 'userId' | 'role'>>;
export type AdminUpdateUserProps = Partial<Omit<User, 'companyId' | 'userId'>>;

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
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

export type TKudos = {
  id: string;
  senderId: string;
  receiverId?: string;
  companyId: string;
  message: string;
  title?: string;
  likes: number;
  isAnonymous: boolean;
  isHidden: boolean;
  sender: User;
  receiver: User;
  userLikes: UserLike[];
  comments: Comment[];
  createdAt: string;
};

export interface CreateKudoFormProps {
  senderId: string;
  receiverId: string;
  companyId: string;
  message: string;
  title?: string | null;
  isAnonymous: boolean;
}

export type UpdateKudoProps = Partial<Omit<CreateKudoFormProps, 'senderId' | 'companyId'>> & {
  id: string;
  isHidden?: boolean;
};

export interface UserLike {
  id: string;
  kudoId: string;
  userId: string;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  companyCode: string;
  users: User[];
  kudos: TKudos[];
  createdAt?: EpochTimeStamp;
  updatedAt?: EpochTimeStamp;
  deletedAt?: EpochTimeStamp | null;
}

export type UpdateCompanyProps = Partial<
  Omit<Company, 'companyCode' | 'users' | 'kudos' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

// export interface UpdateCompanyProps {
//   id: string;
//   name?: string | null | undefined;
//   address?: string;
//   city?: string;
//   state?: string;
//   zip?: string;
//   phone?: string;
// }

export interface Comment {
  id: string;
  content: string;
  parentId?: string | null | undefined;
  user: User;
  kudosId: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
  actionType: ActionTypes;
  message: string;
}

export type HTTPClients = 'AUTH' | 'API';

interface QueryParams {
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  limit?: number;
  sortBy?: 'ASC' | 'DESC';
  offset?: number;
  page?: number;
}

export interface UserQueryParams extends QueryParams {
  userId?: string;
  displayName?: string;
  email?: string;
  companyId?: string;
  firstName?: string;
  lastName?: string;
  roles?: Role | Role[];
}

export interface KudosQueryParams extends QueryParams {
  kudosId?: string;
  senderId?: string;
  isHidden?: boolean;
  receiverId?: string;
  message?: string;
  title?: string;
  companyId: string;
  id?: string;
}

export interface CommentQueryParams extends QueryParams {
  commentId?: string;
  kudosId?: string;
  parentId?: string;
  userId?: string;
  content?: string;
}

export interface CompanyQueryParams extends QueryParams {
  companyId?: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  companyCode?: string;
}

export interface UserNotificationQueryParams extends QueryParams {
  id?: string;
  userId?: string;
  isRead?: boolean;
  message?: string;
  actionTypes?: ActionTypes | ActionTypes[];
}

export interface FormInputItemProps<T extends z.ZodTypeAny>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<z.infer<T>, any>;
  name: FieldPath<z.infer<T>>;
  label?: string;
  type?: string;
  onChange?: (...event: any[]) => void;
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
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
  KUDOS = 'KUDOS',
}
