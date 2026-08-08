import { useState } from "react"
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
import { FiPlus, FiActivity, FiUsers, FiHeart, FiDollarSign, FiChevronRight, FiBell, FiMessageSquare, FiAlertCircle, FiX, FiCheckCircle } from "react-icons/fi"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"

import { useCampaigns } from "@/contexts/CampaignsContext"
import influencersData from "@/data/influencers.json"
import notificationsData from "@/data/notifications.json"
import type { Campaign } from "@/types"

// Mock Chart Data
const performanceData = [
  { month: "Jan", reach: 1200000, engagement: 85000 },
  { month: "Feb", reach: 1350000, engagement: 92000 },
  { month: "Mar", reach: 1250000, engagement: 88000 },
  { month: "Apr", reach: 1800000, engagement: 145000 },
  { month: "May", reach: 2100000, engagement: 175000 },
  { month: "Jun", reach: 2400000, engagement: 195000 },
]

export function BrandDashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { campaigns, addCampaign } = useCampaigns()

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    startDate: "",
    endDate: "",
    deliverables: [""]
  })

  const handleAddDeliverable = () => setFormData(prev => ({ ...prev, deliverables: [...prev.deliverables, ""] }))
  
  const handleRemoveDeliverable = (index: number) => setFormData(prev => ({ ...prev, deliverables: prev.deliverables.filter((_, i) => i !== index) }))
  
  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables]
    newDeliverables[index] = value
    setFormData(prev => ({ ...prev, deliverables: newDeliverables }))
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      const newCampaign: Campaign = {
        id: `camp-new-${Date.now()}`,
        title: formData.title,
        brand: {
          id: currentUser?.id || "b-1",
          name: currentUser?.name || "Brand",
          logo: currentUser?.avatar || "",
          industry: "Various",
          campaignsPosted: 1,
          activeCampaigns: 1
        },
        status: "Draft",
        currentPhase: "Brief Sent",
        deliverables: formData.deliverables.filter(d => d.trim() !== ""),
        timeline: { startDate: formData.startDate, endDate: formData.endDate },
        budget: parseInt(formData.budget) || 0,
        assignedInfluencers: [],
        contentApprovalStatus: "Pending"
      }
      addCampaign(newCampaign)
      setTimeout(() => {
        setShowSuccess(false)
        setIsCreateOpen(false)
        setFormData({ title: "", budget: "", startDate: "", endDate: "", deliverables: [""] })
      }, 1500)
    }, 800)
  }
  // Use 4 influencers for recommended
  const recommendedInfluencers = influencersData.slice(0, 4)
  // Use 4 recent notifications
  const recentNotifications = notificationsData.slice(0, 4)

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
        return <FiBell className="h-4 w-4 text-gray-500" />
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
          value="12"
          icon={<FiActivity className="h-5 w-5" />}
          trend={{ value: 8, label: "from last month", direction: "up" }}
        />
        <StatCard
          label="Total Reach"
          value="2.4M"
          icon={<FiUsers className="h-5 w-5" />}
          trend={{ value: 12.5, label: "from last month", direction: "up" }}
        />
        <StatCard
          label="Avg Engagement"
          value="4.8%"
          icon={<FiHeart className="h-5 w-5" />}
          trend={{ value: 0.4, label: "from last month", direction: "up" }}
        />
        <StatCard
          label="Budget Spent"
          value="$45,200"
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
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      name="Reach"
                      dataKey="reach" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      name="Engagement"
                      dataKey="engagement" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 3. Recent Campaigns */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Monitor your ongoing and past campaign statuses.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/campaigns">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
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
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FiActivity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{campaign.title}</h4>
                          <p className="text-sm text-muted-foreground">{campaign.deliverables.length} Deliverables • ${(campaign.budget / 1000).toFixed(0)}k Budget</p>
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
              {recentNotifications.length === 0 ? (
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
              {recommendedInfluencers.length === 0 ? (
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
                            <AvatarImage src={influencer.avatar} alt={influencer.name} />
                            <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{influencer.name}</h4>
                            <p className="text-sm text-muted-foreground">{influencer.category} • {influencer.location.split(',')[0]}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm border-t pt-3">
                          <div>
                            <span className="text-muted-foreground block text-xs mb-0.5">Followers</span>
                            <span className="font-semibold">{(Math.max(...Object.values(influencer.platforms).map(p => p.followers)) / 1000000).toFixed(1)}M</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs mb-0.5">Engagement</span>
                            <span className="font-semibold">{influencer.engagementRate}%</span>
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

      {/* Create Campaign Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>Draft a new campaign and start matching with creators.</DialogDescription>
          </DialogHeader>
          
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Campaign Created!</h3>
              <p className="text-muted-foreground">Your campaign has been successfully drafted.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input id="title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Summer Shred Challenge" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" disabled value={currentUser?.name || "Brand"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input id="budget" type="number" required min="1" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="5000" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Deliverables</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddDeliverable}>
                    <FiPlus className="mr-1 h-3 w-3" /> Add Row
                  </Button>
                </div>
                {formData.deliverables.map((del, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input 
                      value={del} 
                      onChange={(e) => handleDeliverableChange(index, e.target.value)} 
                      placeholder="e.g. 1 Dedicated YouTube Video" 
                      required
                    />
                    {formData.deliverables.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveDeliverable(index)} className="text-destructive shrink-0">
                        <FiX className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Campaign"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
