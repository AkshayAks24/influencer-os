import { Routes, Route } from "react-router-dom"
import { PublicLayout } from "@/layouts/PublicLayout"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { PulseLayout } from "@/layouts/PulseLayout"
import { ProtectedRoute } from "@/components/common/ProtectedRoute"
// import { LandingPage } from "@/pages/LandingPage"
import { Pricing } from "@/pages/Pricing"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { ForgotPassword } from "@/pages/ForgotPassword"
import { NotFound } from "@/pages/NotFound"
// import { BrandDashboard } from "@/pages/BrandDashboard"
// import { InfluencerDashboard } from "@/pages/InfluencerDashboard"

// import { Discovery } from "@/pages/Discovery"

import { Campaigns } from "@/pages/Campaigns"
// import { InfluencerProfile } from "@/pages/InfluencerProfile"
import { Campaign } from "@/pages/Campaign"
import { Notifications } from "@/pages/Notifications"
import { Settings } from "@/pages/Settings"
import { Chat } from "@/pages/Chat"

// Creator Pulse pages
import { PulseHome } from "@/pages/PulseHome"
import { PulseLanding } from "@/pages/PulseLanding"
import { Onboarding } from "@/pages/Onboarding"
import { CreatorDashboard } from "@/pages/CreatorDashboard"

// Admin pages
import { AdminLayout } from "@/layouts/AdminLayout"
import { AdminDashboard } from "@/pages/admin/AdminDashboard"
import { AdminInfluencers } from "@/pages/admin/AdminInfluencers"
import { AdminCreatorProfile } from "@/pages/admin/AdminCreatorProfile"
import { AdminTrendResearch } from "@/pages/admin/AdminTrendResearch"
import { AdminTrendLibrary } from "@/pages/admin/AdminTrendLibrary"
import { AdminAIProcessing } from "@/pages/admin/AdminAIProcessing"
import { AdminReports } from "@/pages/admin/AdminReports"
import { AdminFeedback } from "@/pages/admin/AdminFeedback"


export function AppRoutes() {
  return (
    <Routes>
      {/* Creator Pulse — Public landing page */}
      <Route path="/" element={<PulseLanding />} />

      {/* Creator Pulse — Onboarding flow */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Creator Dashboard — post-onboarding */}
      <Route path="/influencer/dashboard" element={<CreatorDashboard />} />

      {/* Public Routes (legacy layout) */}
      <Route element={<PublicLayout />}>
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Creator Pulse - Standalone Pages */}
      <Route path="/login" element={<Login />} />

      {/* Creator Pulse — Authenticated feed */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PulseLayout />}>
          <Route path="/feed" element={<PulseHome />} />
          {/* Future: /discover, /ideas, /profile */}
        </Route>
      </Route>

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="influencers" element={<AdminInfluencers />} />
        <Route path="influencers/:id" element={<AdminCreatorProfile />} />
        <Route path="research" element={<AdminTrendResearch />} />
        <Route path="library" element={<AdminTrendLibrary />} />
        <Route path="ai-processing" element={<AdminAIProcessing />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="feedback" element={<AdminFeedback />} />
      </Route>

      {/* Authenticated Dashboard Routes (legacy — commented out) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Brand Only Routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={["brand"]} />}>
            <Route path="/brand/dashboard" element={<BrandDashboard />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/campaigns/new" element={<Placeholder name="Create Campaign" />} />
          </Route> */}

          {/* Influencer Only Routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={["influencer"]} />}>
            <Route path="/influencer/dashboard" element={<InfluencerDashboard />} />
          </Route> */}

          {/* Shared Authenticated Routes */}
          <Route path="/campaigns" element={<Campaigns />} />
          {/* <Route path="/profile/:id" element={<InfluencerProfile />} /> */}
          <Route path="/campaign/:id" element={<Campaign />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
