import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { FcGoogle } from "react-icons/fc";

import { useForm } from '@tanstack/react-form'
import { registerApi } from '@/service/authApi'

export const Route = createFileRoute('/sign-up')({
  component: SignUp
})

function SignUp() {

    const navigate = useNavigate()

    const form = useForm({
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      onSubmit: async ({value}) => {
        await registerApi(value.firstName, value.lastName, value.email, value.password)
        navigate({to: '/dashboard'})
      }
    })
  
  
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <form.Field
                      name='firstName'
                      children={(field)=>(
                        <>
                          <Label htmlFor={field.name}>First name</Label>
                          <Input 
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e)=>field.handleChange(e.target.value)} 
                            placeholder="Max" 
                            required 
                          />
                          {field.state.meta.isTouched && field.state.meta.errors.length ? (
                            <em>{field.state.meta.errors.join(", ")}</em>
                          ): null}
                        </>
                      )}
                    >
                    </form.Field>
                  </div>
                  <div className="grid gap-2">
                    <form.Field
                      name='lastName'
                      children={(field)=>(
                        <>
                          <Label htmlFor={field.name}>Last name</Label>
                          <Input 
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e)=>field.handleChange(e.target.value)} 
                            placeholder="Robinson" 
                            required 
                          />
                          {field.state.meta.isTouched && field.state.meta.errors.length ? (
                            <em>{field.state.meta.errors.join(", ")}</em>
                          ): null}
                        </>
                      )}>
                    </form.Field>
                  </div>
                </div>
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
                <div className="grid gap-2">
                  <form.Field
                    name='confirmPassword'
                    validators={{
                      onChangeListenTo: ['password'],
                      onChange: ({value, fieldApi}) =>{
                        if(value !== fieldApi.form.getFieldValue('password')){
                          return 'Passwords do not match'
                        }
                        return undefined
                      }
                    }}
                    children={(field)=>(
                      <>
                        <Label htmlFor={field.name}>Confirm Password</Label>
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
                          <em className='text-red-500'>{field.state.meta.errors.join(", ")}</em>
                        ): null}
                      </>
                    )}/>
                </div>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full" disabled={!canSubmit}>
                      {isSubmitting ? "..." : "Create an account"}
                    </Button>
                  )}
                />
                  <a
                    href="http://localhost:8787/api/auth/google"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FcGoogle className="mr-2" size={20} />
                    Sign up with Google
                  </a>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Log in
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    )
  
}
