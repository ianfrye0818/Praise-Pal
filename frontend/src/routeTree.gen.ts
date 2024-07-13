/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as VerificationLayoutImport } from './routes/_verification-layout'
import { Route as RootLayoutImport } from './routes/_rootLayout'
import { Route as AuthLayoutImport } from './routes/_authLayout'
import { Route as RootLayoutIndexImport } from './routes/_rootLayout/index'
import { Route as RootLayoutAdminLayoutImport } from './routes/_rootLayout/_adminLayout'
import { Route as AuthLayoutSignUpImport } from './routes/_authLayout/sign-up'
import { Route as AuthLayoutSignInImport } from './routes/_authLayout/sign-in'
import { Route as VerificationLayoutVerifyEmailTokenImport } from './routes/_verification-layout/verify-email/$token'
import { Route as VerificationLayoutResetPasswordTokenImport } from './routes/_verification-layout/reset-password/$token'
import { Route as RootLayoutAdminLayoutAdminDashboardImport } from './routes/_rootLayout/_adminLayout/admin/dashboard'
import { Route as RootLayoutAdminLayoutAdminVerifyUserTokenImport } from './routes/_rootLayout/_adminLayout/admin/verify-user.$token'

// Create Virtual Routes

const RootLayoutKudosSentLazyImport = createFileRoute(
  '/_rootLayout/kudos/sent',
)()
const RootLayoutKudosReceivedLazyImport = createFileRoute(
  '/_rootLayout/kudos/received',
)()
const RootLayoutKudosKudosIdLazyImport = createFileRoute(
  '/_rootLayout/kudos/$kudosId',
)()
const RootLayoutAdminLayoutAdminUsersLazyImport = createFileRoute(
  '/_rootLayout/_adminLayout/admin/users',
)()
const RootLayoutAdminLayoutAdminKudosLazyImport = createFileRoute(
  '/_rootLayout/_adminLayout/admin/kudos',
)()

// Create/Update Routes

const VerificationLayoutRoute = VerificationLayoutImport.update({
  id: '/_verification-layout',
  getParentRoute: () => rootRoute,
} as any)

const RootLayoutRoute = RootLayoutImport.update({
  id: '/_rootLayout',
  getParentRoute: () => rootRoute,
} as any)

const AuthLayoutRoute = AuthLayoutImport.update({
  id: '/_authLayout',
  getParentRoute: () => rootRoute,
} as any)

const RootLayoutIndexRoute = RootLayoutIndexImport.update({
  path: '/',
  getParentRoute: () => RootLayoutRoute,
} as any)

const RootLayoutAdminLayoutRoute = RootLayoutAdminLayoutImport.update({
  id: '/_adminLayout',
  getParentRoute: () => RootLayoutRoute,
} as any)

const AuthLayoutSignUpRoute = AuthLayoutSignUpImport.update({
  path: '/sign-up',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutSignInRoute = AuthLayoutSignInImport.update({
  path: '/sign-in',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const RootLayoutKudosSentLazyRoute = RootLayoutKudosSentLazyImport.update({
  path: '/kudos/sent',
  getParentRoute: () => RootLayoutRoute,
} as any).lazy(() =>
  import('./routes/_rootLayout/kudos/sent.lazy').then((d) => d.Route),
)

const RootLayoutKudosReceivedLazyRoute =
  RootLayoutKudosReceivedLazyImport.update({
    path: '/kudos/received',
    getParentRoute: () => RootLayoutRoute,
  } as any).lazy(() =>
    import('./routes/_rootLayout/kudos/received.lazy').then((d) => d.Route),
  )

const RootLayoutKudosKudosIdLazyRoute = RootLayoutKudosKudosIdLazyImport.update(
  {
    path: '/kudos/$kudosId',
    getParentRoute: () => RootLayoutRoute,
  } as any,
).lazy(() =>
  import('./routes/_rootLayout/kudos/$kudosId.lazy').then((d) => d.Route),
)

const VerificationLayoutVerifyEmailTokenRoute =
  VerificationLayoutVerifyEmailTokenImport.update({
    path: '/verify-email/$token',
    getParentRoute: () => VerificationLayoutRoute,
  } as any)

const VerificationLayoutResetPasswordTokenRoute =
  VerificationLayoutResetPasswordTokenImport.update({
    path: '/reset-password/$token',
    getParentRoute: () => VerificationLayoutRoute,
  } as any)

const RootLayoutAdminLayoutAdminUsersLazyRoute =
  RootLayoutAdminLayoutAdminUsersLazyImport.update({
    path: '/admin/users',
    getParentRoute: () => RootLayoutAdminLayoutRoute,
  } as any).lazy(() =>
    import('./routes/_rootLayout/_adminLayout/admin/users.lazy').then(
      (d) => d.Route,
    ),
  )

const RootLayoutAdminLayoutAdminKudosLazyRoute =
  RootLayoutAdminLayoutAdminKudosLazyImport.update({
    path: '/admin/kudos',
    getParentRoute: () => RootLayoutAdminLayoutRoute,
  } as any).lazy(() =>
    import('./routes/_rootLayout/_adminLayout/admin/kudos.lazy').then(
      (d) => d.Route,
    ),
  )

const RootLayoutAdminLayoutAdminDashboardRoute =
  RootLayoutAdminLayoutAdminDashboardImport.update({
    path: '/admin/dashboard',
    getParentRoute: () => RootLayoutAdminLayoutRoute,
  } as any)

const RootLayoutAdminLayoutAdminVerifyUserTokenRoute =
  RootLayoutAdminLayoutAdminVerifyUserTokenImport.update({
    path: '/admin/verify-user/$token',
    getParentRoute: () => RootLayoutAdminLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authLayout': {
      id: '/_authLayout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthLayoutImport
      parentRoute: typeof rootRoute
    }
    '/_rootLayout': {
      id: '/_rootLayout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof RootLayoutImport
      parentRoute: typeof rootRoute
    }
    '/_verification-layout': {
      id: '/_verification-layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof VerificationLayoutImport
      parentRoute: typeof rootRoute
    }
    '/_authLayout/sign-in': {
      id: '/_authLayout/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof AuthLayoutSignInImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_authLayout/sign-up': {
      id: '/_authLayout/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof AuthLayoutSignUpImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_rootLayout/_adminLayout': {
      id: '/_rootLayout/_adminLayout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof RootLayoutAdminLayoutImport
      parentRoute: typeof RootLayoutImport
    }
    '/_rootLayout/': {
      id: '/_rootLayout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof RootLayoutIndexImport
      parentRoute: typeof RootLayoutImport
    }
    '/_verification-layout/reset-password/$token': {
      id: '/_verification-layout/reset-password/$token'
      path: '/reset-password/$token'
      fullPath: '/reset-password/$token'
      preLoaderRoute: typeof VerificationLayoutResetPasswordTokenImport
      parentRoute: typeof VerificationLayoutImport
    }
    '/_verification-layout/verify-email/$token': {
      id: '/_verification-layout/verify-email/$token'
      path: '/verify-email/$token'
      fullPath: '/verify-email/$token'
      preLoaderRoute: typeof VerificationLayoutVerifyEmailTokenImport
      parentRoute: typeof VerificationLayoutImport
    }
    '/_rootLayout/kudos/$kudosId': {
      id: '/_rootLayout/kudos/$kudosId'
      path: '/kudos/$kudosId'
      fullPath: '/kudos/$kudosId'
      preLoaderRoute: typeof RootLayoutKudosKudosIdLazyImport
      parentRoute: typeof RootLayoutImport
    }
    '/_rootLayout/kudos/received': {
      id: '/_rootLayout/kudos/received'
      path: '/kudos/received'
      fullPath: '/kudos/received'
      preLoaderRoute: typeof RootLayoutKudosReceivedLazyImport
      parentRoute: typeof RootLayoutImport
    }
    '/_rootLayout/kudos/sent': {
      id: '/_rootLayout/kudos/sent'
      path: '/kudos/sent'
      fullPath: '/kudos/sent'
      preLoaderRoute: typeof RootLayoutKudosSentLazyImport
      parentRoute: typeof RootLayoutImport
    }
    '/_rootLayout/_adminLayout/admin/dashboard': {
      id: '/_rootLayout/_adminLayout/admin/dashboard'
      path: '/admin/dashboard'
      fullPath: '/admin/dashboard'
      preLoaderRoute: typeof RootLayoutAdminLayoutAdminDashboardImport
      parentRoute: typeof RootLayoutAdminLayoutImport
    }
    '/_rootLayout/_adminLayout/admin/kudos': {
      id: '/_rootLayout/_adminLayout/admin/kudos'
      path: '/admin/kudos'
      fullPath: '/admin/kudos'
      preLoaderRoute: typeof RootLayoutAdminLayoutAdminKudosLazyImport
      parentRoute: typeof RootLayoutAdminLayoutImport
    }
    '/_rootLayout/_adminLayout/admin/users': {
      id: '/_rootLayout/_adminLayout/admin/users'
      path: '/admin/users'
      fullPath: '/admin/users'
      preLoaderRoute: typeof RootLayoutAdminLayoutAdminUsersLazyImport
      parentRoute: typeof RootLayoutAdminLayoutImport
    }
    '/_rootLayout/_adminLayout/admin/verify-user/$token': {
      id: '/_rootLayout/_adminLayout/admin/verify-user/$token'
      path: '/admin/verify-user/$token'
      fullPath: '/admin/verify-user/$token'
      preLoaderRoute: typeof RootLayoutAdminLayoutAdminVerifyUserTokenImport
      parentRoute: typeof RootLayoutAdminLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthLayoutRoute: AuthLayoutRoute.addChildren({
    AuthLayoutSignInRoute,
    AuthLayoutSignUpRoute,
  }),
  RootLayoutRoute: RootLayoutRoute.addChildren({
    RootLayoutAdminLayoutRoute: RootLayoutAdminLayoutRoute.addChildren({
      RootLayoutAdminLayoutAdminDashboardRoute,
      RootLayoutAdminLayoutAdminKudosLazyRoute,
      RootLayoutAdminLayoutAdminUsersLazyRoute,
      RootLayoutAdminLayoutAdminVerifyUserTokenRoute,
    }),
    RootLayoutIndexRoute,
    RootLayoutKudosKudosIdLazyRoute,
    RootLayoutKudosReceivedLazyRoute,
    RootLayoutKudosSentLazyRoute,
  }),
  VerificationLayoutRoute: VerificationLayoutRoute.addChildren({
    VerificationLayoutResetPasswordTokenRoute,
    VerificationLayoutVerifyEmailTokenRoute,
  }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authLayout",
        "/_rootLayout",
        "/_verification-layout"
      ]
    },
    "/_authLayout": {
      "filePath": "_authLayout.tsx",
      "children": [
        "/_authLayout/sign-in",
        "/_authLayout/sign-up"
      ]
    },
    "/_rootLayout": {
      "filePath": "_rootLayout.tsx",
      "children": [
        "/_rootLayout/_adminLayout",
        "/_rootLayout/",
        "/_rootLayout/kudos/$kudosId",
        "/_rootLayout/kudos/received",
        "/_rootLayout/kudos/sent"
      ]
    },
    "/_verification-layout": {
      "filePath": "_verification-layout.tsx",
      "children": [
        "/_verification-layout/reset-password/$token",
        "/_verification-layout/verify-email/$token"
      ]
    },
    "/_authLayout/sign-in": {
      "filePath": "_authLayout/sign-in.tsx",
      "parent": "/_authLayout"
    },
    "/_authLayout/sign-up": {
      "filePath": "_authLayout/sign-up.tsx",
      "parent": "/_authLayout"
    },
    "/_rootLayout/_adminLayout": {
      "filePath": "_rootLayout/_adminLayout.tsx",
      "parent": "/_rootLayout",
      "children": [
        "/_rootLayout/_adminLayout/admin/dashboard",
        "/_rootLayout/_adminLayout/admin/kudos",
        "/_rootLayout/_adminLayout/admin/users",
        "/_rootLayout/_adminLayout/admin/verify-user/$token"
      ]
    },
    "/_rootLayout/": {
      "filePath": "_rootLayout/index.tsx",
      "parent": "/_rootLayout"
    },
    "/_verification-layout/reset-password/$token": {
      "filePath": "_verification-layout/reset-password/$token.tsx",
      "parent": "/_verification-layout"
    },
    "/_verification-layout/verify-email/$token": {
      "filePath": "_verification-layout/verify-email/$token.tsx",
      "parent": "/_verification-layout"
    },
    "/_rootLayout/kudos/$kudosId": {
      "filePath": "_rootLayout/kudos/$kudosId.lazy.tsx",
      "parent": "/_rootLayout"
    },
    "/_rootLayout/kudos/received": {
      "filePath": "_rootLayout/kudos/received.lazy.tsx",
      "parent": "/_rootLayout"
    },
    "/_rootLayout/kudos/sent": {
      "filePath": "_rootLayout/kudos/sent.lazy.tsx",
      "parent": "/_rootLayout"
    },
    "/_rootLayout/_adminLayout/admin/dashboard": {
      "filePath": "_rootLayout/_adminLayout/admin/dashboard.tsx",
      "parent": "/_rootLayout/_adminLayout"
    },
    "/_rootLayout/_adminLayout/admin/kudos": {
      "filePath": "_rootLayout/_adminLayout/admin/kudos.lazy.tsx",
      "parent": "/_rootLayout/_adminLayout"
    },
    "/_rootLayout/_adminLayout/admin/users": {
      "filePath": "_rootLayout/_adminLayout/admin/users.lazy.tsx",
      "parent": "/_rootLayout/_adminLayout"
    },
    "/_rootLayout/_adminLayout/admin/verify-user/$token": {
      "filePath": "_rootLayout/_adminLayout/admin/verify-user.$token.tsx",
      "parent": "/_rootLayout/_adminLayout"
    }
  }
}
ROUTE_MANIFEST_END */
