import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { FiBriefcase, FiCamera, FiMail, FiAlertCircle } from "react-icons/fi"

import { useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader } from "@/components/common/Loader"
import { cn } from "@/lib/utils"

interface RegisterFormData {
  name: string
  email: string
  password: string
  terms: boolean
}

export function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role>("brand")
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setApiError("")
    try {
      const user = await login(data.email, data.password, selectedRole, data.name)
      
      if (user.role === "brand") {
        navigate("/brand/dashboard", { replace: true })
      } else {
        navigate("/influencer/dashboard", { replace: true })
      }
    } catch (error) {
      console.error(error)
      setApiError("Registration failed. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-140px)] w-screen flex-col items-center justify-center py-12">
      <Card className="w-full max-w-[450px] border-none shadow-xl bg-background">
        <CardHeader className="space-y-1 pb-6 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Join InfluencerOS to scale your partnerships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Role Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole("brand")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-accent",
                  selectedRole === "brand" ? "border-primary bg-primary/5 text-primary" : "border-muted bg-transparent text-muted-foreground"
                )}
              >
                <FiBriefcase className="h-6 w-6" />
                <span className="font-semibold text-sm">I'm a Brand</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("influencer")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-accent",
                  selectedRole === "influencer" ? "border-primary bg-primary/5 text-primary" : "border-muted bg-transparent text-muted-foreground"
                )}
              >
                <FiCamera className="h-6 w-6" />
                <span className="font-semibold text-sm">I'm a Creator</span>
              </button>
            </div>
            
            {apiError && (
              <Alert variant="destructive">
                <FiAlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name", { required: "Name is required" })}
                  className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                  })}
                  className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", { required: "You must accept the terms" })}
                className="mt-1 h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary focus:ring-offset-2"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms" className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Accept terms and conditions
                </Label>
                <p className="text-xs text-muted-foreground">
                  You agree to our Terms of Service and Privacy Policy.
                </p>
                {errors.terms && (
                  <p className="text-xs text-destructive">{errors.terms.message}</p>
                )}
              </div>
            </div>

            <Button className="w-full h-11" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader size="sm" className="p-0" />
              ) : (
                <>
                  <FiMail className="mr-2 h-4 w-4" /> Create Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
