/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignUpImport } from './routes/sign-up'
import { Route as SettingsImport } from './routes/settings'
import { Route as ResetPasswordImport } from './routes/reset-password'
import { Route as LoginImport } from './routes/login'
import { Route as ForgotPasswordImport } from './routes/forgot-password'
import { Route as DashboardImport } from './routes/dashboard'
import { Route as ChatImport } from './routes/chat'
import { Route as ArchitectImport } from './routes/architect'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as GoogleCallbackImport } from './routes/google/callback'

// Create/Update Routes

const SignUpRoute = SignUpImport.update({
  id: '/sign-up',
  path: '/sign-up',
  getParentRoute: () => rootRoute,
} as any)

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const ResetPasswordRoute = ResetPasswordImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const ForgotPasswordRoute = ForgotPasswordImport.update({
  id: '/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => rootRoute,
} as any)

const DashboardRoute = DashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const ChatRoute = ChatImport.update({
  id: '/chat',
  path: '/chat',
  getParentRoute: () => rootRoute,
} as any)

const ArchitectRoute = ArchitectImport.update({
  id: '/architect',
  path: '/architect',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const GoogleCallbackRoute = GoogleCallbackImport.update({
  id: '/google/callback',
  path: '/google/callback',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/architect': {
      id: '/architect'
      path: '/architect'
      fullPath: '/architect'
      preLoaderRoute: typeof ArchitectImport
      parentRoute: typeof rootRoute
    }
    '/chat': {
      id: '/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/forgot-password': {
      id: '/forgot-password'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof ForgotPasswordImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/reset-password': {
      id: '/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof ResetPasswordImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/sign-up': {
      id: '/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof SignUpImport
      parentRoute: typeof rootRoute
    }
    '/google/callback': {
      id: '/google/callback'
      path: '/google/callback'
      fullPath: '/google/callback'
      preLoaderRoute: typeof GoogleCallbackImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/architect': typeof ArchitectRoute
  '/chat': typeof ChatRoute
  '/dashboard': typeof DashboardRoute
  '/forgot-password': typeof ForgotPasswordRoute
  '/login': typeof LoginRoute
  '/reset-password': typeof ResetPasswordRoute
  '/settings': typeof SettingsRoute
  '/sign-up': typeof SignUpRoute
  '/google/callback': typeof GoogleCallbackRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/architect': typeof ArchitectRoute
  '/chat': typeof ChatRoute
  '/dashboard': typeof DashboardRoute
  '/forgot-password': typeof ForgotPasswordRoute
  '/login': typeof LoginRoute
  '/reset-password': typeof ResetPasswordRoute
  '/settings': typeof SettingsRoute
  '/sign-up': typeof SignUpRoute
  '/google/callback': typeof GoogleCallbackRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/architect': typeof ArchitectRoute
  '/chat': typeof ChatRoute
  '/dashboard': typeof DashboardRoute
  '/forgot-password': typeof ForgotPasswordRoute
  '/login': typeof LoginRoute
  '/reset-password': typeof ResetPasswordRoute
  '/settings': typeof SettingsRoute
  '/sign-up': typeof SignUpRoute
  '/google/callback': typeof GoogleCallbackRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/architect'
    | '/chat'
    | '/dashboard'
    | '/forgot-password'
    | '/login'
    | '/reset-password'
    | '/settings'
    | '/sign-up'
    | '/google/callback'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/architect'
    | '/chat'
    | '/dashboard'
    | '/forgot-password'
    | '/login'
    | '/reset-password'
    | '/settings'
    | '/sign-up'
    | '/google/callback'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/architect'
    | '/chat'
    | '/dashboard'
    | '/forgot-password'
    | '/login'
    | '/reset-password'
    | '/settings'
    | '/sign-up'
    | '/google/callback'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  ArchitectRoute: typeof ArchitectRoute
  ChatRoute: typeof ChatRoute
  DashboardRoute: typeof DashboardRoute
  ForgotPasswordRoute: typeof ForgotPasswordRoute
  LoginRoute: typeof LoginRoute
  ResetPasswordRoute: typeof ResetPasswordRoute
  SettingsRoute: typeof SettingsRoute
  SignUpRoute: typeof SignUpRoute
  GoogleCallbackRoute: typeof GoogleCallbackRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  ArchitectRoute: ArchitectRoute,
  ChatRoute: ChatRoute,
  DashboardRoute: DashboardRoute,
  ForgotPasswordRoute: ForgotPasswordRoute,
  LoginRoute: LoginRoute,
  ResetPasswordRoute: ResetPasswordRoute,
  SettingsRoute: SettingsRoute,
  SignUpRoute: SignUpRoute,
  GoogleCallbackRoute: GoogleCallbackRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/architect",
        "/chat",
        "/dashboard",
        "/forgot-password",
        "/login",
        "/reset-password",
        "/settings",
        "/sign-up",
        "/google/callback"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/architect": {
      "filePath": "architect.tsx"
    },
    "/chat": {
      "filePath": "chat.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard.tsx"
    },
    "/forgot-password": {
      "filePath": "forgot-password.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/reset-password": {
      "filePath": "reset-password.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/sign-up": {
      "filePath": "sign-up.tsx"
    },
    "/google/callback": {
      "filePath": "google/callback.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
