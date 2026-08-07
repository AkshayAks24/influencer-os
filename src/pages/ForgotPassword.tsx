import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader } from "@/components/common/Loader"

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState("")
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = async (_data: any) => {
    setIsLoading(true)
    setApiError("")
    try {
      // Simulate network delay for password reset email
      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsSuccess(true)
    } catch (error) {
      console.error(error)
      setApiError("Failed to send reset link. Please verify your email.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-140px)] w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-[400px] border-none shadow-xl bg-background">
        
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <FiCheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight mb-2">Check your email</CardTitle>
            <p className="text-muted-foreground mb-8">
              We have sent a password reset link to your email address.
            </p>
            <Button asChild className="w-full h-11">
              <Link to="/login">Return to login</Link>
            </Button>
          </div>
        ) : (
          <>
            <CardHeader className="space-y-1 pb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FiMail className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
              <CardDescription>
                Enter your email address and we will send you a verification link
              </CardDescription>
            </CardHeader>
            <CardContent>
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

                <Button className="w-full h-11" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader size="sm" className="p-0" />
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-6">
              <Link to="/login" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
