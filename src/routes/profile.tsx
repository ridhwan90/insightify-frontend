import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { validateSession } from '@/service/authApi'
import { useEffect } from 'react'
import { useAuthStore } from '@/state/authStore'


export const Route = createFileRoute('/profile')({
  component: Profile
})

function Profile() {
  const navigate = useNavigate()

  const { user, setUser } = useAuthStore()

  const { data: sessionUser, isPending} = useQuery({
    queryKey: ['get-current-user'],
    queryFn: validateSession,
    staleTime: Infinity,
    retry: false
  })

  useEffect(() => {
    if (sessionUser) {
      setUser(sessionUser)
    } else if (!isPending) {
      navigate({ to: '/' })
    }
  }, [sessionUser, isPending, setUser, navigate])

  if (isPending) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg p-8 shadow-md">
        <p className="text-2xl text-center">{`Welcome ${user?.firstName} ${user?.lastName}`}</p>
        <p className="text-center">{user?.email}</p>
      </div>
    </div>
  )
}