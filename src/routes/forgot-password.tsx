import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HiOutlineMail } from "react-icons/hi"
import { RiLockPasswordLine } from "react-icons/ri"
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { checkEmailExists, generateOTP, validateOTP } from '@/service/authApi'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPassword
})

function ForgotPassword() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPInput, setShowOTPInput] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const emailForm = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null)
        setSuccess(null)
        setIsLoading(true)
        
        // Check if email exists
        const exists = await checkEmailExists(value.email)
        
        if (!exists) {
          setError('No account found with this email address')
          return
        }
        
        // Generate and send OTP
        await generateOTP(value.email, 'RESET_PASSWORD')
        
        // Store email and show OTP input
        setEmail(value.email)
        setShowOTPInput(true)
        setSuccess('A verification code has been sent to your email')
      } catch (err) {
        setError('Unable to process your request. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    },
  })

  const otpForm = useForm({
    defaultValues: {
      otp: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null)
        setSuccess(null)
        setIsLoading(true)
        
        const validateOTPResponse = await validateOTP(email, value.otp, 'RESET_PASSWORD')
        
        // If successful, navigate to reset password page
        navigate({ 
          to: '/reset-password',
          search: {
            email,
            resetToken: validateOTPResponse.resetToken,
          }
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid verification code')
      } finally {
        setIsLoading(false)
      }
    },
  })

  const resendOTP = async () => {
    try {
      setError(null)
      setSuccess(null)
      setIsLoading(true)
      
      await generateOTP(email, 'RESET_PASSWORD')
      setSuccess('A new verification code has been sent to your email')
    } catch (err) {
      setError('Failed to resend verification code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/50">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="relative w-full max-w-sm px-4">
        <div className="absolute -top-4 -right-4 h-40 w-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 bg-accent/20 rounded-full blur-3xl" />
        
        <Card className="relative border-muted/50 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">
                {showOTPInput ? 'Enter Verification Code' : 'Reset Password'}
              </CardTitle>
              <CardDescription>
                {showOTPInput 
                  ? 'Enter the verification code sent to your email'
                  : 'Enter your email address and we\'ll send you a verification code.'
                }
              </CardDescription>
            </div>
          </CardHeader>

          {!showOTPInput ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                emailForm.handleSubmit();
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
                    <emailForm.Field
                      name='email'
                      children={(field) => (
                        <>
                          <Label htmlFor={field.name} className="text-muted-foreground">
                            Email
                          </Label>
                          <div className="relative">
                            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="m@example.com"
                              required
                              type="email"
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                          {field.state.meta.isTouched && field.state.meta.errors.length ? (
                            <p className="text-sm text-destructive mt-1">{field.state.meta.errors.join(", ")}</p>
                          ) : null}
                        </>
                      )} />
                  </div>
                </div>

                <div className="space-y-4">
                  <emailForm.Subscribe
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
                            Sending verification code...
                          </>
                        ) : (
                          "Send verification code"
                        )}
                      </Button>
                    )} />
                </div>
              </CardContent>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                otpForm.handleSubmit();
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
                    <otpForm.Field
                      name='otp'
                      children={(field) => (
                        <>
                          <Label htmlFor={field.name} className="text-muted-foreground">
                            Verification Code
                          </Label>
                          <div className="relative">
                            <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => {
                                // Only allow numbers and limit to 6 digits
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                                field.handleChange(value)
                              }}
                              placeholder="Enter 6-digit code"
                              required
                              className="pl-10 tracking-widest text-center font-mono"
                              disabled={isLoading}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={6}
                            />
                          </div>
                          {field.state.meta.isTouched && field.state.meta.errors.length ? (
                            <p className="text-sm text-destructive mt-1">{field.state.meta.errors.join(", ")}</p>
                          ) : null}
                        </>
                      )} />
                  </div>
                </div>

                <div className="space-y-4">
                  <otpForm.Subscribe
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
                            Verifying...
                          </>
                        ) : (
                          "Verify Code"
                        )}
                      </Button>
                    )} />

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={isLoading}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Didn't receive the code? Click to resend
                    </button>
                  </div>
                </div>
              </CardContent>
            </form>
          )}

          <CardFooter className="flex justify-center border-t border-muted/50 p-6">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Back to login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}