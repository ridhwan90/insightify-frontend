import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/components/auth/AuthProvider'
import { useEffect } from 'react'
import { axiosInstance, setAxiosToken } from '@/service/authApi'

interface GoogleCallbackResponse {
  accessToken: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    picture: string
  }
}

export const Route = createFileRoute('/google/callback')({
  component: GoogleCallback
})

function GoogleCallback() {
  const navigate = useNavigate()
  const { setAccessToken, setCurrentUser } = useAuth()

  useEffect(() => {
    async function handleCallback() {
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')

      if (!code) {
        console.error('No authorization code found')
        navigate({ to: '/login' })
        return
      }

      try {
        // Exchange code for tokens and user data
        const response = await axiosInstance.post('/google/callback', {
          code
        }, {
          withCredentials: true
        })

        const data = response.data as GoogleCallbackResponse

        // Set access token in localStorage and axios headers
        localStorage.setItem('accessToken', data.accessToken)
        setAxiosToken(data.accessToken)
        setAccessToken(data.accessToken)

        // Set user data in auth context
        setCurrentUser({
          cuid: data.user.id,  // Use the Google ID as the cuid
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          picture: data.user.picture
        })
        
        // Redirect to dashboard on success
        navigate({ to: '/dashboard' })
      } catch (error) {
        console.error('Google callback error:', error)
        navigate({ to: '/login' })
      }
    }

    handleCallback()
  }, [navigate, setAccessToken, setCurrentUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Processing Google Sign In...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
}
