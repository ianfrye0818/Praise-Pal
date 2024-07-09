import { Company, SidebarLink, TKudos, User } from '@/types';
import {
  PackageOpen,
  SendIcon,
  Mailbox,
  ShieldCheck,
  UserIcon,
  ScrollText,
  LayoutDashboard,
} from 'lucide-react';
import { env } from '@/zodSchemas/env';

export const QueryKeys = {
  allKudos: ['kudos'],
  limitKudos: (limit: number) => ['kudos', { limit }],
  singleKudo: (kudoId: string) => ['singleKudos', kudoId],
  sentKudos: ['kudos', 'sent'],
  receivedKudos: ['kudos', 'received'],
  allUsers: ['user'],
  singleUser: (userId: string) => ['users', userId],
  company: ['company'],
  userNotifications: ['userNotifications'],
  comments: ['comments'],
  verifyToken: (token: string) => ['verifyToken', token],
};

export const sidebarLinks: SidebarLink[] = [
  {
    label: 'View All',
    route: '/',
    icon: PackageOpen,
  },
  {
    label: 'Received Kudos',
    route: '/kudos/received',
    icon: Mailbox,
  },
  {
    label: 'Sent Kudos',
    route: '/kudos/sent',
    icon: SendIcon,
  },
];

export const adminSidebarLinks: SidebarLink[] = [
  {
    label: 'Dashboard',
    route: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    route: '/admin/users',
    icon: UserIcon,
  },
  {
    label: 'Kudos',
    route: '/admin/kudos',
    icon: ScrollText,
  },
];

export const adminSideBarLink: SidebarLink = {
  icon: ShieldCheck,
  label: 'Admin Dashboard',
  route: '/admin/dashboard',
};

export const MAX_API_RETRY_REQUESTS = 3;
export const BASE_API_URL = env.VITE_API_BASE_URL;
console.log(BASE_API_URL);

export const SIGN_UP_FORM_DEFAULT_VALUES = {
  email: '',
  password: '',
  confirmPassword: '',
  companyCode: '',
};

export const SIGN_IN_FORM_DEFAULT_VALUES = {
  email: '',
  password: '',
};

export const ADD_KUDOS_DIALOG_FORM_DEFAULT_VALUES = (senderId: string, companyId: string) => {
  return { title: '', message: '', isAnonymous: false, receiverId: '', senderId, companyId };
};

export function EDIT_KUDOS_DIALOG_FORM_DEFAULT_VALUES(kudo: TKudos) {
  return {
    title: kudo.title,
    message: kudo.message,
    isHidden: kudo.isHidden,
    id: kudo.id,
    companyId: kudo.companyId,
  };
}

export const UPDATE_USER_DIALOG_DEFAULT_VALUES = (user: User) => {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
};

export const UPDATE_COMPANY_DIALOG_DEFAULT_VALUES = (company: Company) => {
  return {
    name: company.name,
    address: company.address,
    city: company.city,
    state: company.state,
    zip: company.zip,
    phone: company.phone,
  };
};

export const RESET_PASSWORD_DEFAULT_VALUES = (token: string) => {
  return { token, password: '', confirmPassword: '' };
};
