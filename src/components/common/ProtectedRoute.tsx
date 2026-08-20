import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/contexts/AuthContext"
import { Loader } from "@/components/common/Loader"

export interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader size="lg" />
      </div>
    )
  }

  if (!currentUser) {
    // Redirect unauthenticated users to login, saving the intended path
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to correct dashboard if role doesn't match
    const redirectPath = currentUser.role === "brand" ? "/brand/dashboard" : "/influencer/dashboard"
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
