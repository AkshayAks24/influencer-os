import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/common/StatCard"
import { EmptyState } from "@/components/common/EmptyState"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/common/Skeleton"
import { FiPlus, FiActivity, FiUsers, FiHeart, FiDollarSign, FiChevronRight, FiBell, FiMessageSquare, FiAlertCircle, FiX, FiCheckCircle } from "react-icons/fi"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"

import { useCampaigns } from "@/contexts/CampaignsContext"
import { useNotifications } from "@/contexts/NotificationsContext"
import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal"
import apiClient from "@/lib/apiClient"


export function BrandDashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { campaigns, isLoading, fetchCampaigns } = useCampaigns()
  const { notifications } = useNotifications()

  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [recommendedInfluencers, setRecommendedInfluencers] = useState<any[]>([])
  const [isInfluencersLoading, setIsInfluencersLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get('/dashboard/brand')
        setDashboardStats(response.data)
        setRecommendedInfluencers(response.data.recommended_influencers || [])
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setIsStatsLoading(false)
        setIsInfluencersLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Use 4 recent notifications
  const recentNotifications = notifications.slice(0, 4)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
      case "in review":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
      case "draft":
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-500/20"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <FiMessageSquare className="h-4 w-4 text-blue-500" />
      case "campaign":
        return <FiActivity className="h-4 w-4 text-green-500" />
      case "alert":
        return <FiAlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FiBell className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      {/* 1. Overview Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {currentUser?.name || "Brand"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your influencer campaigns today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="shrink-0" onClick={() => setIsCreateOpen(true)}>
            <FiPlus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>
      </div>

      {/* 2. Analytics Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Campaigns"
          value={isStatsLoading ? "-" : (dashboardStats?.active_campaigns || "0")}
          icon={<FiActivity className="h-5 w-5" />}
          trend={{ value: 8, label: "from last month", direction: "up" }}
        />
        <StatCard
          label="Completed Campaigns"
          value={isStatsLoading ? "-" : (dashboardStats?.completed_campaigns || "0")}
          icon={<FiCheckCircle className="h-5 w-5" />}
          trend={{ value: 12.5, label: "from last month", direction: "up" }}
        />
        <StatCard
          label="Influencers Engaged"
          value={isStatsLoading ? "-" : (dashboardStats?.total_influencers_worked_with || "0")}
          icon={<FiUsers className="h-5 w-5" />}
          trend={{ value: 0.4, label: "from last month", direction: "up" }}
        />
        <StatCard
          label="Budget Spent"
          value={isStatsLoading ? "-" : `$${(dashboardStats?.total_spending || 0).toLocaleString()}`}
          icon={<FiDollarSign className="h-5 w-5" />}
          trend={{ value: 2, label: "from last month", direction: "down" }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
        {/* Left Column (Charts & Campaigns) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Reach and engagement across all campaigns over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] w-full mt-4 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <Skeleton key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              ) : (
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardStats?.reach_over_time || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#8C93A3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#8C93A3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#141B2B', borderColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3EFE6', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      name="Reach"
                      dataKey="value" 
                      stroke="#D6A85A" 
                      strokeWidth={3}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Recent Campaigns */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Monitor your ongoing and past campaign statuses.</CardDescription>
              </div>
              <Link to="/campaigns" className="text-sm text-primary hover:underline font-medium">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : campaigns.length === 0 ? (
                <EmptyState
                  icon={<FiActivity className="h-8 w-8" />}
                  title="No campaigns yet"
                  description="You haven't created any campaigns. Create your first campaign to get started."
                  actionText="Create Campaign"
                  onAction={() => setIsCreateOpen(true)}
                  className="min-h-[250px]"
                />
              ) : (
                <div className="space-y-4">
                  {campaigns.slice(0, 4).map((campaign, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={campaign.id}
                      onClick={() => navigate(`/campaign/${campaign.id}`)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-primary/10 transition-colors cursor-pointer gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FiActivity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{campaign.title}</h4>
                          <p className="text-sm text-muted-foreground">{campaign.deliverables?.length || 0} Deliverables • ${(campaign.budget / 1000).toFixed(0)}k Budget</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-start sm:self-auto">
                        <Badge variant="outline" className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <FiChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Influencers & Notifications) */}
        <div className="space-y-8">
          
          {/* 5. Notifications Panel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Link to="/notifications" className="text-sm text-primary hover:underline font-medium">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 items-start">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentNotifications.length === 0 ? (
                <EmptyState
                  icon={<FiBell className="h-8 w-8" />}
                  title="No new notifications"
                  description="You're all caught up!"
                  className="min-h-[200px]"
                />
              ) : (
                <div className="space-y-4 mt-4">
                  {recentNotifications.map((notification, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={notification.id} 
                      className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="space-y-1">
                        <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. Recommended Influencers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Matches</CardTitle>
              <CardDescription>AI-curated creators for your brand</CardDescription>
            </CardHeader>
            <CardContent>
              {isInfluencersLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col p-4 rounded-xl border bg-card gap-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t pt-3">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendedInfluencers.length === 0 ? (
                <EmptyState
                  icon={<FiUsers className="h-8 w-8" />}
                  title="No matches found"
                  description="We couldn't find any influencers matching your criteria right now."
                  className="min-h-[200px]"
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {recommendedInfluencers.map((influencer, i) => {
                    const matchScore = Math.floor(Math.random() * (99 - 85 + 1) + 85); // Mock score 85-99%
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={influencer.id}
                        onClick={() => navigate(`/profile/${influencer.id}`)}
                        className="group flex flex-col p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="absolute top-3 right-3 z-10">
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-semibold border-primary/20">
                            {matchScore}% Match
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={influencer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${influencer.username}`} alt={influencer.username} />
                            <AvatarFallback>{influencer.username?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{influencer.username}</h4>
                            <p className="text-sm text-muted-foreground">{influencer.category} • {influencer.location?.split(',')[0] || "Global"}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm border-t pt-3">
                          <div>
                            <span className="text-muted-foreground block text-xs mb-0.5">Followers</span>
                            <span className="font-semibold">{(influencer.follower_count / 1000000).toFixed(1)}M</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs mb-0.5">Engagement</span>
                            <span className="font-semibold">{influencer.engagement_rate}%</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
              <Button variant="ghost" className="w-full mt-4" asChild>
                <Link to="/discovery">Explore More Creators</Link>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>

      <CreateCampaignModal isOpen={isCreateOpen} onClose={setIsCreateOpen} />
    </div>
  )
}
