import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RiLockPasswordLine } from "react-icons/ri"
import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { verifyResetToken, resetPassword } from '@/service/authApi'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => {
    // Ensure email and resetToken are present
    if (!search.email || !search.resetToken) {
      throw new Error('Invalid reset password link')
    }
    return {
      email: String(search.email),
      resetToken: String(search.resetToken)
    }
  },
  component: VerifyToken
})

function VerifyToken() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const navigate = useNavigate()
  const search = useSearch({ from: '/reset-password' })

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (value.password.length < 8) {
        setError('Password must be at least 8 characters long')
        return
      }

      setError(null)
      setSuccess(null)
      setIsLoading(true)
        
      try {
        await resetPassword(search.email, value.password, search.resetToken)
        setSuccess('Password reset successful')
        setTimeout(() => {
          navigate({ to: '/login' })
        }, 2000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reset password')
      } finally {
        setIsLoading(false)
      }
    },
  })

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await verifyResetToken(search.resetToken)
        if (response.valid && response.email === search.email) {
          setIsVerified(true)
        } else {
          throw new Error('Invalid reset token')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid reset token')
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [search.email, search.resetToken])

  if (isLoading) {
    return (
      <div className="container relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[400px] items-center justify-center px-4 py-8">
        <div className="absolute -top-8 -right-8 h-40 w-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 bg-accent/20 rounded-full blur-3xl" />
        
        <Card className="relative border-muted/50 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">Verifying Token</CardTitle>
              <CardDescription>
                Please wait while we verify your reset token...
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <svg
              className="h-8 w-8 animate-spin text-primary"
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
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state if token verification failed
  if (!isVerified) {
    return (
      <div className="container relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[400px] items-center justify-center px-4 py-8">
        <div className="absolute -top-8 -right-8 h-40 w-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 bg-accent/20 rounded-full blur-3xl" />
        
        <Card className="relative border-muted/50 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-destructive">Invalid Reset Link</CardTitle>
              <CardDescription>
                {error || 'The password reset link is invalid or has expired.'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pb-8">
            <svg
              className="h-12 w-12 text-destructive"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <Button 
              variant="default" 
              onClick={() => navigate({ to: '/forgot-password' })}
              className="mt-2"
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show reset password form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/50">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="relative w-full max-w-sm px-4">
        <div className="absolute -top-4 -right-4 h-40 w-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 bg-accent/20 rounded-full blur-3xl" />
        
        <Card className="relative border-muted/50 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
              <CardDescription>
                Enter your new password below.
              </CardDescription>
            </div>
          </CardHeader>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-500/10 rounded-md">
                  {success}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <form.Field
                    name='password'
                    children={(field) => (
                      <>
                        <Label htmlFor={field.name} className="text-muted-foreground">
                          New Password
                        </Label>
                        <div className="relative">
                          <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="password"
                            className="pl-10"
                            disabled={isLoading}
                            required
                            minLength={8}
                            placeholder="Min. 8 characters"
                          />
                        </div>
                      </>
                    )} 
                  />
                </div>

                <div className="space-y-2">
                  <form.Field
                    name='confirmPassword'
                    children={(field) => (
                      <>
                        <Label htmlFor={field.name} className="text-muted-foreground">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="password"
                            className="pl-10"
                            disabled={isLoading}
                            required
                            minLength={8}
                            placeholder="Re-enter password"
                          />
                        </div>
                      </>
                    )} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!canSubmit || isSubmitting || isLoading}
                      variant="gradient"
                    >
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
                          Submit..
                        </>
                      ) : (
                        "Verify Token"
                      )}
                    </Button>
                  )} 
                />
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}