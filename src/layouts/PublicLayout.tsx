import { Navigate, Outlet } from "react-router-dom"
import { Navbar } from "@/components/common/Navbar"
import { Footer } from "@/components/common/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { Loader } from "@/components/common/Loader"

export function PublicLayout() {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader size="lg" />
      </div>
    )
  }

  if (currentUser) {
    const redirectPath = currentUser.role === "brand" ? "/brand/dashboard" : "/influencer/dashboard"
    return <Navigate to={redirectPath} replace />
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
