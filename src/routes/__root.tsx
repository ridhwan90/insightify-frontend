import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import  Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'
import { type QueryClient } from '@tanstack/react-query'


interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Index,
})

function Index() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}