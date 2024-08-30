import { createRootRoute, Outlet } from '@tanstack/react-router'
import  Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'

export const Route = createRootRoute({
    component: Index
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