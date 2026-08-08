import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiArrowLeft, FiCheckCircle, FiClock, FiFileText, FiMessageSquare, FiActivity, FiCheck, FiX, FiAlertCircle, FiImage } from "react-icons/fi"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/common/EmptyState"
import { Skeleton } from "@/components/common/Skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useAuth } from "@/contexts/AuthContext"
import { useCampaigns } from "@/contexts/CampaignsContext"
import type { Campaign, CampaignDeliverable } from "@/types"

const PHASES = ["Brief Sent", "Content Creation", "Review", "Approved", "Live", "Completed"]

export function Campaign() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { campaigns } = useCampaigns()
  const [isLoading, setIsLoading] = useState(true)
  
  const campaign = campaigns.find(c => c.id === id)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (!campaign) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <EmptyState 
          icon={<FiAlertCircle className="h-10 w-10" />}
          title="Campaign Not Found"
          description="We couldn't find the campaign you were looking for."
          actionText="Back to Dashboard"
          onAction={() => navigate(currentUser?.role === 'brand' ? '/brand/dashboard' : '/influencer/dashboard')}
        />
      </div>
    )
  }

  // Determine current phase index
  const currentPhaseIndex = campaign.currentPhase ? PHASES.indexOf(campaign.currentPhase) : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Back Button */}
      <Button variant="ghost" className="mb-2 -ml-4" onClick={() => navigate(-1)}>
        <FiArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {isLoading ? (
          <>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-8">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={campaign.brand.logo} alt={campaign.brand.name} />
                <AvatarFallback>{campaign.brand.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">{campaign.title}</h1>
                  <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground font-medium">{campaign.brand.name}</p>
              </div>
            </div>
            
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                <p className="font-semibold text-lg">${campaign.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Timeline</p>
                <p className="font-medium text-sm">
                  {new Date(campaign.timeline.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - 
                  {new Date(campaign.timeline.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Timeline (Stepper) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${(currentPhaseIndex / (PHASES.length - 1)) * 100}%` }}
            />
            {PHASES.map((phase, index) => {
              const isCompleted = index < currentPhaseIndex;
              const isCurrent = index === currentPhaseIndex;
              return (
                <div key={phase} className="relative flex flex-col items-center gap-2 z-10 w-24">
                  <div 
                    className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                      isCurrent ? "bg-card border-primary text-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]" : 
                      "bg-card border-muted-foreground/30 text-muted-foreground/30"
                    }`}
                  >
                    {isCompleted ? <FiCheck className="h-3 w-3" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                  </div>
                  <span className={`text-[11px] font-medium text-center uppercase tracking-wider ${
                    isCurrent ? "text-primary font-bold" : 
                    isCompleted ? "text-foreground" : 
                    "text-muted-foreground"
                  }`}>
                    {phase}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Content Approval & Comments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Content Approval */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FiImage className="h-5 w-5" /> Content Submission
              </CardTitle>
              <CardDescription>Review and approve draft content for the campaign.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="border rounded-xl overflow-hidden">
                      <Skeleton className="aspect-video w-full rounded-none" />
                    </div>
                  ))}
                </div>
              ) : campaign.submittedContent && campaign.submittedContent.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {campaign.submittedContent.map(content => (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={content.id} 
                      className="border rounded-xl overflow-hidden group cursor-pointer"
                    >
                      <div className="aspect-video relative bg-muted">
                        <img src={content.thumbnailUrl} alt="Content thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <Badge variant={content.status === 'approved' ? 'default' : content.status === 'changes_requested' ? 'destructive' : 'secondary'} className="capitalize backdrop-blur-md bg-background/80">
                            {content.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      {currentUser?.role === 'brand' && content.status === 'pending' && (
                        <div className="p-3 bg-muted/30 border-t flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <FiX className="mr-2 h-4 w-4" /> Request Changes
                          </Button>
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <FiCheck className="mr-2 h-4 w-4" /> Approve
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<FiImage className="h-8 w-8" />}
                  title="No content submitted"
                  description="Content drafts will appear here once the influencer uploads them."
                  className="min-h-[200px] border-none shadow-none bg-muted/20"
                />
              )}
            </CardContent>
          </Card>

          {/* Comments / Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FiMessageSquare className="h-5 w-5" /> Feedback & Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.comments && campaign.comments.length > 0 ? (
                <div className="space-y-4">
                  {campaign.comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback className={comment.authorRole === 'brand' ? 'bg-primary/10 text-primary' : 'bg-muted'}>
                          {comment.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-sm">{comment.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm mt-1 text-foreground/90">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<FiMessageSquare className="h-6 w-6" />}
                  title="No comments"
                  description="No feedback has been left on this campaign yet."
                  className="min-h-[150px] border-none shadow-none bg-muted/20"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Deliverables & Activity */}
        <div className="space-y-6">
          
          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FiFileText className="h-5 w-5" /> Deliverables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaign.deliverables.map((del, i) => {
                  // Handle both old string format and new object format
                  const isObj = typeof del !== 'string'
                  const id = isObj ? (del as CampaignDeliverable).id : `del-${i}`
                  const desc = isObj ? (del as CampaignDeliverable).description : del as string
                  const completed = isObj ? (del as CampaignDeliverable).completed : false

                  return (
                    <div key={id} className="flex items-start gap-3 p-3 border rounded-xl bg-card">
                      <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${completed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                        {completed ? <FiCheckCircle className="h-4 w-4" /> : <FiClock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {desc}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {completed ? 'Completed' : 'Pending submission'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FiActivity className="h-5 w-5" /> Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.activityLog && campaign.activityLog.length > 0 ? (
                <div className="relative pl-4 border-l space-y-6 ml-2">
                  {campaign.activityLog.map((log) => (
                    <div key={log.id} className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary"></span>
                      <p className="text-sm font-medium leading-tight">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
