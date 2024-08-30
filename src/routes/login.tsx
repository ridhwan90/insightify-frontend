import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc";

import { useForm } from '@tanstack/react-form'

export const Route = createFileRoute('/login')({
  component: Login
})

function Login(){

 
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      console.log(values)
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Log In</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <form.Field
                  name='email'
                  children={(field)=>(
                    <>
                      <Label htmlFor={field.name}>Email</Label>
                      <Input 
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e)=>field.handleChange(e.target.value)} 
                        placeholder="m@example.com" 
                        required 
                        type="email"
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length ? (
                        <em>{field.state.meta.errors.join(", ")}</em>
                      ): null}
                    </>
                  )}/>
              </div>
              <div className="grid gap-2">
                <form.Field
                  name='password'
                  children={(field)=>(
                    <>
                      <Label htmlFor={field.name}>Password</Label>
                      <Input 
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e)=>field.handleChange(e.target.value)} 
                        required 
                        type="password"
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length ? (
                        <em>{field.state.meta.errors.join(", ")}</em>
                      ): null}
                    </>
                  )}/>
              </div>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" className="w-full" disabled={!canSubmit}>
                    {isSubmitting ? "..." : "Login"}
                  </Button>
                )}
              />
              <Button variant="outline" className="w-full">
                <FcGoogle className="mr-2" size={20} />
                  Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to='/sign-up' className="underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}