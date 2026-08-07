import { Routes, Route } from "react-router-dom"
import { PublicLayout } from "@/layouts/PublicLayout"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { ProtectedRoute } from "@/components/common/ProtectedRoute"
import { LandingPage } from "@/pages/LandingPage"
import { Pricing } from "@/pages/Pricing"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { ForgotPassword } from "@/pages/ForgotPassword"
import { NotFound } from "@/pages/NotFound"
import { BrandDashboard } from "@/pages/BrandDashboard"
import { InfluencerDashboard } from "@/pages/InfluencerDashboard"

import { Discovery } from "@/pages/Discovery"

import { InfluencerProfile } from "@/pages/InfluencerProfile"

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Authenticated Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Brand Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={["brand"]} />}>
            <Route path="/brand/dashboard" element={<BrandDashboard />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/campaigns/new" element={<Placeholder name="Create Campaign" />} />
          </Route>

          {/* Influencer Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={["influencer"]} />}>
            <Route path="/influencer/dashboard" element={<InfluencerDashboard />} />
          </Route>

          {/* Shared Authenticated Routes */}
          <Route path="/campaigns" element={<Placeholder name="Campaigns & Brands" />} />
          <Route path="/profile/:id" element={<InfluencerProfile />} />
          <Route path="/campaign/:id" element={<Placeholder name="Campaign Details" />} />
          <Route path="/settings" element={<Placeholder name="Settings" />} />
          <Route path="/notifications" element={<Placeholder name="Notifications" />} />
          <Route path="/chat" element={<Placeholder name="Chat" />} />
        </Route>
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
