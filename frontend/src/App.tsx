import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { useAuth } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './providers/AuthReducerProvider';
import AdminModeProvider from './providers/AdminModeProvider';
import { InfinitySpin } from 'react-loader-spinner';
import NotFoundComponent from './components/pages-and-sections/not-found-component';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorComponent from './components/pages-and-sections/error-component';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
    mutations: {
      retry: 2,
    },
  },
});
const router = createRouter({
  routeTree,
  context: { state: undefined! },
  defaultNotFoundComponent: NotFoundComponent,
  defaultPendingComponent: () => (
    <div className='h-[100dvh] w-full flex justify-center items-center'>
      <InfinitySpin
        width='200'
        color='#4fa94d'
      />
    </div>
  ),
  defaultErrorComponent: ErrorComponent,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const { state } = useAuth();
  return (
    <RouterProvider
      router={router}
      context={{ state }}
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminModeProvider>
          <InnerApp />
          {/* 

          <ReactQueryDevtools />
          */}
        </AdminModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
