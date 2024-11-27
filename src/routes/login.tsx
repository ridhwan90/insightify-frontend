import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"
import { HiOutlineMail } from "react-icons/hi"
import { RiLockPasswordLine } from "react-icons/ri"
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '@/components/auth/AuthProvider'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    // If auth is loading, don't redirect yet
    if (context.auth.isLoading) {
      return
    }
    // If user is already authenticated, redirect to dashboard
    if (context.auth.currentUser) {
      throw redirect({
        to: '/dashboard'
      })
    }
  },
  component: Login
})

function Login() {
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null)
        await login(value.email, value.password)
        window.location.href = '/dashboard'
      } catch (err) {
        setError('Invalid email or password')
      }
    },
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/50">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="relative w-full max-w-sm px-4">
        <div className="absolute -top-4 -right-4 h-40 w-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 bg-accent/20 rounded-full blur-3xl" />
        
        <Card className="relative border-muted/50 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
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
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <form.Field
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
                          />
                        </div>
                        {field.state.meta.isTouched && field.state.meta.errors.length ? (
                          <p className="text-sm text-destructive mt-1">{field.state.meta.errors.join(", ")}</p>
                        ) : null}
                      </>
                    )} />
                </div>
                <div className="space-y-2">
                  <form.Field
                    name='password'
                    children={(field) => (
                      <>
                        <Label htmlFor={field.name} className="text-muted-foreground">
                          Password
                        </Label>
                        <div className="relative">
                          <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            required
                            type="password"
                            className="pl-10"
                          />
                        </div>
                        <div className="flex items-center justify-end">
                          <Link
                            to="/forgot-password"
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        {field.state.meta.isTouched && field.state.meta.errors.length ? (
                          <p className="text-sm text-destructive mt-1">{field.state.meta.errors.join(", ")}</p>
                        ) : null}
                      </>
                    )} />
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
                      {isSubmitting || isLoading ? (
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
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  )} />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <a
                  href="http://localhost:8787/api/auth/google"
                  className="w-full"
                >
                  <Button type="button" variant="outline" className="w-full">
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </a>
              </div>
            </CardContent>
          </form>
          <CardFooter className="flex justify-center border-t border-muted/50 p-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}