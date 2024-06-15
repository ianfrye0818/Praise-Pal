import { PropsWithChildren } from 'react';
import AuthSessionProvider from './session-provider';

export default function Providers({ children }: PropsWithChildren) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
