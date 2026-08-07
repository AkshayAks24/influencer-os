import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/contexts/AuthContext"

export interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser } = useAuth()
  const location = useLocation()

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
