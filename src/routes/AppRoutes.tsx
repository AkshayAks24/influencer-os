import { Routes, Route } from "react-router-dom"
import { PublicLayout } from "@/layouts/PublicLayout"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { LandingPage } from "@/pages/LandingPage"
import { Pricing } from "@/pages/Pricing"

// Placeholder component for unimplemented pages
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-2">{name}</h2>
      <p>Page coming soon...</p>
    </div>
  </div>
)

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Placeholder name="Login" />} />
        <Route path="/register" element={<Placeholder name="Register" />} />
        <Route path="/forgot-password" element={<Placeholder name="Forgot Password" />} />
      </Route>

      {/* Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/brand/dashboard" element={<Placeholder name="Brand Dashboard" />} />
        <Route path="/influencer/dashboard" element={<Placeholder name="Influencer Dashboard" />} />
        <Route path="/discovery" element={<Placeholder name="Discovery" />} />
        <Route path="/profile/:id" element={<Placeholder name="Profile" />} />
        <Route path="/campaign/:id" element={<Placeholder name="Campaign Details" />} />
        <Route path="/settings" element={<Placeholder name="Settings" />} />
        <Route path="/notifications" element={<Placeholder name="Notifications" />} />
        <Route path="/chat" element={<Placeholder name="Chat" />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Placeholder name="404 Not Found" />} />
    </Routes>
  )
}
