import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/components/auth/AuthProvider'
import { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm } from '@tanstack/react-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { changePassword } from '@/service/authApi'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser === null) {
      navigate({ to: '/login' })
    }
  }, [currentUser, navigate])

  if (currentUser === undefined) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-[calc(100vh-72px)] px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="account" className="w-full">
            <div className="flex gap-8">
              {/* Sidebar */}
              <div className="w-64 shrink-0">
                <TabsList className="flex h-auto w-full flex-col items-start justify-start gap-1 bg-transparent p-0">
                  <TabsTrigger 
                    value="account" 
                    className="w-full justify-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted data-[state=active]:bg-muted"
                  >
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Account
                  </TabsTrigger>
                  <TabsTrigger 
                    value="profile" 
                    className="w-full justify-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted data-[state=active]:bg-muted"
                  >
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="password" 
                    className="w-full justify-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted data-[state=active]:bg-muted"
                  >
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Password
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <TabsContent value="account" className="mt-0 border-none p-0 outline-none">
                  <Account />
                </TabsContent>
                <TabsContent value="profile" className="mt-0 border-none p-0 outline-none">
                  <Profile />
                </TabsContent>
                <TabsContent value="password" className="mt-0 border-none p-0 outline-none">
                  <Password />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function Account() {
  const { currentUser } = useAuth()

  const form = useForm({
    defaultValues: {
      email: currentUser?.email,
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
    },
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Account Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your account settings and personal information
        </p>
      </div>

      <Separator />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-8"
      >
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              defaultValue={currentUser?.email || ''}
              className="w-full bg-muted"
              disabled
            />
            <p className="text-sm text-muted-foreground">
              This account is registered under this email address and cannot be changed.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                defaultValue={currentUser?.firstName || ''}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                defaultValue={currentUser?.lastName || ''}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  )
}

function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your public profile information and preferences
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Update your profile picture. This will be displayed on your profile and in comments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-muted">
                {/* Add profile picture preview here */}
              </div>
              <Button>Upload New Picture</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
            <CardDescription>
              Write a short bio to tell people more about yourself
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Write something about yourself..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button>Save Profile</Button>
      </div>
    </div>
  )
}

function Password() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const { newPassword, confirmPassword } = formState

      // Validate passwords match
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Validate password requirements
      const hasMinLength = newPassword.length >= 8
      const hasUpperCase = /[A-Z]/.test(newPassword)
      const hasLowerCase = /[a-z]/.test(newPassword)
      const hasNumber = /[0-9]/.test(newPassword)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

      if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        const missing = []
        if (!hasMinLength) missing.push('8 characters')
        if (!hasUpperCase) missing.push('uppercase letter')
        if (!hasLowerCase) missing.push('lowercase letter')
        if (!hasNumber) missing.push('number')
        if (!hasSpecialChar) missing.push('special character')
        
        throw new Error(`Password must include: ${missing.join(', ')}`)
      }

      // Call the API to change password
      await changePassword(newPassword)
      setSuccess('Password updated successfully')
      setFormState({ newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Password Settings</h2>
        <p className="text-sm text-muted-foreground">
          Change your password to keep your account secure
        </p>
      </div>

      <Separator />

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              className="w-full"
              disabled={isLoading}
              value={formState.newPassword}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground">
              Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              className="w-full"
              disabled={isLoading}
              value={formState.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Settings
