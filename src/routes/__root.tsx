import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'
import { type QueryClient } from '@tanstack/react-query'
import { AuthContext } from '@/components/auth/AuthProvider'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}