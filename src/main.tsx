import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import AuthProvider, { useAuth } from './components/auth/AuthProvider'

// Create a new router instance with proper typing for auth context
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // Initialize with loading state to prevent premature redirects
    auth: {
      isLoading: true,
      accessToken: null,
      currentUser: null,
      login: async () => { throw new Error('Auth not initialized') },
      logout: async () => { throw new Error('Auth not initialized') },
      fetchCurrentUser: async () => { throw new Error('Auth not initialized') },
      handleGoogleRedirect: async () => { throw new Error('Auth not initialized') },
    }
  },
  // Add defaultPreload to ensure auth is loaded
  defaultPreload: 'intent',
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth, queryClient }} />
}

function App(){
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
