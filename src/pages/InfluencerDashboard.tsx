import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/common/StatCard"
import { EmptyState } from "@/components/common/EmptyState"
import { FiCheckCircle, FiCircle, FiActivity, FiDollarSign, FiTrendingUp, FiChevronRight, FiStar, FiCalendar, FiBriefcase } from "react-icons/fi"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

import campaignsData from "@/data/campaigns.json"

// Mock Chart Data
const earningsData = [
  { month: "Jan", earnings: 1200 },
  { month: "Feb", earnings: 2100 },
  { month: "Mar", earnings: 1800 },
  { month: "Apr", earnings: 3400 },
  { month: "May", earnings: 2800 },
  { month: "Jun", earnings: 4200 },
]

const analyticsData = [
  { month: "Jan", followers: 450, engagement: 4.2 },
  { month: "Feb", followers: 462, engagement: 4.5 },
  { month: "Mar", followers: 485, engagement: 4.8 },
  { month: "Apr", followers: 512, engagement: 5.1 },
  { month: "May", followers: 535, engagement: 5.4 },
  { month: "Jun", followers: 580, engagement: 5.8 },
]

const checklist = [
  { id: 1, label: "Add profile picture", completed: true },
  { id: 2, label: "Connect Instagram", completed: true },
  { id: 3, label: "Set pricing tiers", completed: false },
  { id: 4, label: "Upload portfolio", completed: false },
]

export function InfluencerDashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  // Use the first 2 campaigns as "Active/Pending" invites
  const activeCampaigns = campaignsData.slice(1, 3)
  
  // Use the next 3 campaigns as "AI Recommendations"
  const recommendedCampaigns = campaignsData.slice(3, 6)

  const completionPercentage = Math.round((checklist.filter(c => c.completed).length / checklist.length) * 100)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
      case "in review":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
      case "draft":
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {currentUser?.name || "Creator"}! ✨
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your growth, manage collaborations, and discover new opportunities.
          </p>
        </div>
        <Button className="shrink-0" asChild>
          <Link to="/campaigns">Find Brands</Link>
        </Button>
      </div>

      {/* Analytics Cards Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Earnings"
          value="$15,500"
          icon={<FiDollarSign className="h-5 w-5" />}
          trend={{ value: 12, label: "from last month", direction: "up" }}
        />
        <StatCard
          label="This Month"
          value="$4,200"
          icon={<FiTrendingUp className="h-5 w-5" />}
          trend={{ value: 8, label: "from last month", direction: "up" }}
        />
        <StatCard
          label="Pending Payout"
          value="$1,850"
          icon={<FiCalendar className="h-5 w-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Earnings & Analytics Charts */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            
            {/* Earnings Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earnings Overview</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={earningsData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                        formatter={(value: number | string | readonly (number | string)[] | undefined) => [`$${Number(value || 0)}`, "Earnings"]}
                      />
                      <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Growth Analytics Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Growth Analytics</CardTitle>
                <CardDescription>Followers (k) vs Engagement (%)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="followers" name="Followers (k)" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="engagement" name="Engagement (%)" stroke="#10b981" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Campaigns */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Campaigns</CardTitle>
                <CardDescription>Active collaborations and pending invites.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/campaigns">Manage All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeCampaigns.length === 0 ? (
                <EmptyState
                  icon={<FiBriefcase className="h-8 w-8" />}
                  title="No active campaigns"
                  description="You don't have any ongoing collaborations right now."
                  actionText="Find Brands"
                  onAction={() => navigate("/discovery")}
                  className="min-h-[200px]"
                />
              ) : (
                <div className="space-y-4">
                  {activeCampaigns.map((campaign, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={campaign.id}
                      onClick={() => navigate(`/campaign/${campaign.id}`)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer gap-4"
                    >
                      <div className="flex items-center gap-4">
                        {campaign.brand?.logo ? (
                          <img src={campaign.brand.logo} alt={campaign.brand.name} className="h-10 w-10 rounded-full border shadow-sm" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <FiActivity className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold">{campaign.title}</h4>
                          <p className="text-sm text-muted-foreground">{campaign.brand?.name || "Brand"} • ${(campaign.budget / 1000).toFixed(0)}k</p>
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

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Setup</CardTitle>
              <CardDescription>Complete your profile to get more brand deals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Completion</span>
                  <span className="font-bold text-primary">{completionPercentage}%</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    {item.completed ? (
                      <FiCheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <FiCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <span className={item.completed ? "text-muted-foreground line-through" : "font-medium"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6" variant={completionPercentage === 100 ? "outline" : "default"}>
                {completionPercentage === 100 ? "Edit Profile" : "Complete Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FiStar className="h-5 w-5 text-yellow-500" />
                <CardTitle className="text-lg">Match For You</CardTitle>
              </div>
              <CardDescription>Campaigns that fit your niche and audience.</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendedCampaigns.length === 0 ? (
                <EmptyState
                  icon={<FiStar className="h-8 w-8" />}
                  title="No matches found"
                  description="We couldn't find any campaigns that fit your niche right now."
                  className="min-h-[150px]"
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {recommendedCampaigns.map((campaign, i) => {
                    const matchScore = Math.floor(Math.random() * (99 - 85 + 1) + 85);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={campaign.id}
                        onClick={() => navigate(`/campaign/${campaign.id}`)}
                        className="group flex flex-col p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="absolute top-3 right-3 z-10">
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-semibold border-primary/20">
                            {matchScore}% Match
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {campaign.brand?.logo ? (
                            <img src={campaign.brand.logo} alt={campaign.brand.name} className="h-10 w-10 rounded-full border shadow-sm" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <FiBriefcase className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="pr-16">
                            <h4 className="font-semibold group-hover:text-primary transition-colors text-sm line-clamp-1">{campaign.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">{campaign.brand?.name}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between text-sm border-t pt-3">
                          <span className="font-semibold">${(campaign.budget / 1000).toFixed(0)}k</span>
                          <span className="text-muted-foreground">{campaign.deliverables.length} Deliverables</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
