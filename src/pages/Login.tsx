import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FiFacebook, FiInstagram, FiMail, FiAlertCircle } from "react-icons/fi"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader } from "@/components/common/Loader"

interface LoginFormData {
  email: string
  password: string
  remember: boolean
}

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setApiError("")
    try {
      const user = await login(data.email, data.password, data.remember)
      
      const destination = location.state?.from?.pathname || (user.role === "brand" ? "/brand/dashboard" : "/influencer/dashboard")
      navigate(destination, { replace: true })
    } catch (error) {
      console.error(error)
      setApiError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-140px)] w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-[400px] border-none shadow-xl bg-background">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="font-bold text-primary-foreground text-2xl leading-none">I</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button variant="outline" className="h-11">
              <FiFacebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button variant="outline" className="h-11">
              <FiInstagram className="mr-2 h-4 w-4" />
              Instagram
            </Button>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {apiError && (
            <Alert variant="destructive" className="mb-6">
              <FiAlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email", { required: "Email is required" })}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                {...register("remember")}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary focus:ring-offset-2"
              />
              <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me
              </Label>
            </div>

            <Button className="w-full h-11" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader size="sm" className="p-0" />
              ) : (
                <>
                  <FiMail className="mr-2 h-4 w-4" /> Sign In with Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
