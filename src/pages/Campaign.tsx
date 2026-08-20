import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiArrowLeft, FiCheckCircle, FiClock, FiFileText, FiActivity, FiCheck, FiX, FiAlertCircle, FiImage, FiUploadCloud, FiUsers } from "react-icons/fi"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/common/EmptyState"
import { Skeleton } from "@/components/common/Skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/apiClient"

const PHASES = ["Brief Sent", "Content Creation", "Review", "Approved", "Live", "Completed"]

export function Campaign() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [isLoading, setIsLoading] = useState(true)
  const [campaign, setCampaign] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [contents, setContents] = useState<any[]>([])
  const [assignment, setAssignment] = useState<any>(null) // The relevant assignment for this view

  // Alert Dialog states
  const [alertState, setAlertState] = useState<{isOpen: boolean, title: string, message: string, isError: boolean}>({ isOpen: false, title: "", message: "", isError: false })

  // Form states
  const [contentUrl, setContentUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [influencerProfile, setInfluencerProfile] = useState<any>(null)
  const [isUpdatingPhase, setIsUpdatingPhase] = useState(false)
  const [isSubmittingLiveUrl, setIsSubmittingLiveUrl] = useState(false)
  const [liveUrlInput, setLiveUrlInput] = useState("")
  const [isSubmittingContent, setIsSubmittingContent] = useState(false)
  const [isReviewingContent, setIsReviewingContent] = useState(false)

  const fetchCampaignData = async () => {
    setIsLoading(true)
    try {
      let myProfileId = null
      if (currentUser?.role === 'influencer') {
        try {
          const profileRes = await apiClient.get('/influencers/me')
          myProfileId = profileRes.data.id
          setInfluencerProfile(profileRes.data)
        } catch (e) {
          console.error("Failed to fetch influencer profile", e)
        }
      }

      const campRes = await apiClient.get(`/campaigns/${id}`)
      setCampaign(campRes.data)

      // Find the assignment relevant to the current user (if influencer) or just use the first one for brand (simplified for now)
      let currentAssignment = null
      if (campRes.data.assignments && campRes.data.assignments.length > 0) {
        if (currentUser?.role === 'influencer') {
          currentAssignment = campRes.data.assignments.find((a: any) => a.influencer_id === myProfileId)
        } else {
          currentAssignment = campRes.data.assignments[0] // Just taking the first for brand demo purposes
        }
        setAssignment(currentAssignment)
      }

      // Fetch Applications to check if influencer applied or to show to brand
      try {
        const appRes = await apiClient.get(`/campaigns/${id}/applications`)
        setApplications(appRes.data.items || [])
      } catch (e) {
        console.error("Failed to fetch applications", e)
      }

      // Fetch Content if Assignment exists
      if (currentAssignment) {
        try {
          const contentRes = await apiClient.get(`/assignments/${currentAssignment.id}/content`)
          setContents(contentRes.data || [])
        } catch (e) {
          console.error("Failed to fetch content", e)
        }
      }

    } catch (error) {
      console.error("Failed to fetch campaign", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchCampaignData()
  }, [id, currentUser])



  const handleAcceptApplication = async (appId: number) => {
    try {
      await apiClient.put(`/applications/${appId}/status`, { status: "accepted" })
      fetchCampaignData()
    } catch (error) {
      setAlertState({ isOpen: true, title: "Error", message: "Failed to accept application", isError: true })
    }
  }

  const handleRejectApplication = async (appId: number) => {
    try {
      await apiClient.put(`/applications/${appId}/status`, { status: "rejected" })
      fetchCampaignData()
    } catch (error) {
      setAlertState({ isOpen: true, title: "Error", message: "Failed to reject application", isError: true })
    }
  }

  const handleToggleDeliverable = async (deliverableId: number) => {
    try {
      await apiClient.patch(`/deliverables/${deliverableId}/toggle`)
      fetchCampaignData()
    } catch (error) {
      console.error("Failed to toggle deliverable", error)
    }
  }

  const handleSubmitContent = async () => {
    if (!assignment || (!contentUrl && !selectedFile)) return
    setIsSubmittingContent(true)
    try {
      // In a real app, we would upload the file to a cloud storage here and get the URL back.
      // Since we don't have an upload endpoint, we will use the filename or the provided URL.
      const finalUrl = selectedFile ? selectedFile.name : contentUrl
      
      await apiClient.post(`/assignments/${assignment.id}/content`, {
        media_url: finalUrl,
        caption: "Draft submission"
      })
      setContentUrl("")
      setSelectedFile(null)
      setPreviewUrl("")
      setAlertState({ isOpen: true, title: "Success", message: "Content submitted successfully!", isError: false })
      fetchCampaignData()
    } catch (error: any) {
      console.error("Failed to submit content", error)
      setAlertState({ isOpen: true, title: "Error", message: error.response?.data?.detail || "Failed to submit content", isError: true })
    } finally {
      setIsSubmittingContent(false)
    }
  }

  const handleReviewContent = async (contentId: number, status: string) => {
    setIsReviewingContent(true)
    try {
      await apiClient.patch(`/content/${contentId}/review`, {
        decision: status,
        note: status === 'changes_requested' ? "Please adjust the lighting." : "Looks great!"
      })
      fetchCampaignData()
    } catch (error: any) {
      console.error("Failed to review content", error)
      setAlertState({ isOpen: true, title: "Error", message: error.response?.data?.detail || "Failed to review content", isError: true })
    } finally {
      setIsReviewingContent(false)
    }
  }

  const handleUpdatePhase = async (newPhase: string) => {
    if (!assignment) return
    setIsUpdatingPhase(true)
    try {
      await apiClient.patch(`/assignments/${assignment.id}/phase`, { phase: newPhase })
      fetchCampaignData()
    } catch (error: any) {
      console.error("Failed to update phase", error)
      setAlertState({ isOpen: true, title: "Error", message: error.response?.data?.detail || "Failed to update phase", isError: true })
    } finally {
      setIsUpdatingPhase(false)
    }
  }

  const handleSubmitLiveUrl = async () => {
    if (!assignment || !liveUrlInput.trim()) return
    setIsSubmittingLiveUrl(true)
    try {
      await apiClient.post(`/assignments/${assignment.id}/live-url`, { live_url: liveUrlInput.trim() })
      setLiveUrlInput("")
      fetchCampaignData()
    } catch (error: any) {
      console.error("Failed to submit live URL", error)
      setAlertState({ isOpen: true, title: "Error", message: error.response?.data?.detail || "Failed to submit live URL", isError: true })
    } finally {
      setIsSubmittingLiveUrl(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await apiClient.put(`/campaigns/${id}`, { status: newStatus })
      fetchCampaignData()
    } catch (error: any) {
      setAlertState({ isOpen: true, title: "Error", message: error.response?.data?.detail || "Failed to update campaign status", isError: true })
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8 flex flex-col items-center">
        <Skeleton className="h-16 w-16 mb-4 rounded-full" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }

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

  // Determine current phase index from the assignment, or fallback to 0
  const phaseValue = assignment?.current_phase || "Brief Sent"
  // The backend enum is lowercase (e.g. "brief_sent"). Let's try to map it gracefully.
  const formattedPhase = phaseValue.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
  
  let currentPhaseIndex = PHASES.indexOf(formattedPhase)
  if (currentPhaseIndex === -1) {
    // try exact match or just default to 0
    currentPhaseIndex = PHASES.findIndex(p => p.toLowerCase() === formattedPhase.toLowerCase())
    if (currentPhaseIndex === -1) currentPhaseIndex = 0
  }

  const isInfluencer = currentUser?.role === 'influencer'
  const isBrand = currentUser?.role === 'brand'
  
  // Influencers can't fetch applications from the backend due to brand-only role restrictions.
  // We use localStorage to remember if they applied locally.
  const storageKey = `applied_${id}_${currentUser?.id}`
  const localAppliedState = localStorage.getItem(storageKey)

  const userApplication = applications.find((a: any) => a.influencer_id === influencerProfile?.id || a.influencer_id == currentUser?.id)
  const hasApplied = !!userApplication || !!assignment || !!localAppliedState
  const applicationStatus = userApplication ? userApplication.status : (assignment ? 'accepted' : (localAppliedState || 'pending'))

  const handleApplyClick = () => {
    // If it's open and they haven't applied, call handleApply
    if (campaign.status === 'open' && !hasApplied) {
      handleApply()
    }
  }

  // Update handleApply to set localStorage
  const handleApply = async () => {
    try {
      await apiClient.post(`/campaigns/${id}/apply`, {
        proposal: "I would love to participate in this campaign!",
        proposed_price: campaign.budget
      })
      setAlertState({ isOpen: true, title: "Success", message: "Application submitted successfully!", isError: false })
      localStorage.setItem(storageKey, 'pending')
      fetchCampaignData()
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Already applied
        localStorage.setItem(storageKey, 'pending')
        setAlertState({ isOpen: true, title: "Notice", message: "You have already applied to this campaign.", isError: false })
        fetchCampaignData()
      } else {
        setAlertState({ isOpen: true, title: "Error", message: error.response?.data?.detail || "Failed to apply", isError: true })
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Back Button */}
      <Button variant="ghost" className="mb-2 -ml-4" onClick={() => navigate(-1)}>
        <FiArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={campaign.brand?.logo} alt={campaign.brand?.company_name} />
            <AvatarFallback>{campaign.brand?.company_name?.charAt(0) || "B"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{campaign.title}</h1>
              {isBrand ? (
                <select 
                  value={campaign.status === 'in_progress' ? 'active' : campaign.status}
                  onChange={(e) => {
                    const status = e.target.value === 'active' ? 'in_progress' : e.target.value;
                    handleStatusChange(status);
                  }}
                  className="bg-secondary text-secondary-foreground text-sm font-semibold rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-primary/50 capitalize cursor-pointer border border-border"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ) : (
                <Badge variant={(campaign.status === "active" || campaign.status === "in_progress") ? "default" : "secondary"} className="capitalize">
                  {campaign.status === "in_progress" ? "Active" : campaign.status}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground font-medium">{campaign.brand?.company_name}</p>
          </div>
        </div>
        
        <div className="flex gap-8 items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Budget</p>
            <p className="font-semibold text-lg">${campaign.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Timeline</p>
            <p className="font-medium text-sm">
              {new Date(campaign.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - 
              {new Date(campaign.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          </div>
          {isInfluencer && (
            <Button 
              onClick={handleApplyClick}
              disabled={hasApplied || campaign.status !== 'open'}
              variant={hasApplied ? "secondary" : "default"}
              className={`w-40 ${hasApplied && applicationStatus === 'rejected' ? 'bg-red-50 text-red-600 border border-red-200' : ''}`}
            >
              {!hasApplied ? 'Apply to Campaign' : 
               applicationStatus === 'pending' ? 'Application Pending' : 
               applicationStatus === 'accepted' ? 'Application Approved' : 
               'Application ' + applicationStatus}
            </Button>
          )}
        </div>
      </div>

      {/* Timeline (Stepper) */}
      {assignment && (
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
      )}

      {/* Brand View: Applications */}
      {isBrand && applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FiUsers className="h-5 w-5" /> Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app: any) => (
                <div key={app.id} className="flex justify-between items-center p-4 border rounded-xl">
                  <div>
                    <p className="font-semibold">{app.influencer?.name || app.influencer?.username || "Unknown Influencer"}</p>
                    <p className="text-sm text-muted-foreground">{app.proposal || app.pitch}</p>
                    <p className="text-xs mt-1 font-medium text-primary">Proposed Rate: ${app.proposed_price || app.proposed_rate}</p>
                  </div>
                  <div className="flex gap-2">
                    {app.status === 'pending' ? (
                      <>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleRejectApplication(app.id)}>Reject</Button>
                        <Button size="sm" onClick={() => handleAcceptApplication(app.id)}>Accept</Button>
                      </>
                    ) : (
                      <Badge className={`capitalize ${app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}`}>{app.status}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Content Approval & Comments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Content Submission & Review */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FiImage className="h-5 w-5" /> Content Submission
              </CardTitle>
              <CardDescription>Review and approve draft content for the campaign.</CardDescription>
            </CardHeader>
            <CardContent>
              {isInfluencer && assignment && (
                <div className="mb-8">
                  {assignment.current_phase === 'brief_sent' && (
                    <div className="border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card">
                      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <FiFileText className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Campaign Brief Sent</h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                        The brand has accepted your application and sent a brief. Please accept to begin content creation.
                      </p>
                      <Button onClick={() => handleUpdatePhase('content_creation')} disabled={isUpdatingPhase} className="px-8">
                        {isUpdatingPhase ? 'Accepting...' : 'Accept Brief'}
                      </Button>
                    </div>
                  )}

                  {assignment.current_phase === 'content_creation' && (
                    <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card transition-colors hover:bg-muted/10">
                      <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0])
                            setPreviewUrl(URL.createObjectURL(e.target.files[0]))
                          }
                        }}
                        accept="image/*,video/*"
                      />
                      
                      {!selectedFile ? (
                        <>
                          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <FiUploadCloud className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Upload Content</h3>
                          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                            Select a file from your computer to submit as draft content for this campaign.
                          </p>
                          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="px-8 border-primary/20 hover:bg-primary/5">
                            Select File
                          </Button>
                        </>
                      ) : (
                        <div className="w-full max-w-sm flex flex-col items-center">
                          <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted mb-4 w-full shadow-sm">
                            {selectedFile.type.startsWith('image/') ? (
                              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <video src={previewUrl} className="w-full h-full object-cover" controls />
                            )}
                          </div>
                          <div className="flex items-center justify-between w-full mb-6 p-3 bg-secondary/50 border rounded-lg">
                            <div className="flex items-center gap-3 overflow-hidden pr-4">
                              <FiImage className="h-5 w-5 text-muted-foreground shrink-0" />
                              <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedFile(null); setPreviewUrl(""); }} className="h-8 text-xs shrink-0">
                              Change
                            </Button>
                          </div>
                          <Button className="w-full" onClick={handleSubmitContent} disabled={isSubmittingContent}>
                            {isSubmittingContent ? 'Submitting...' : 'Submit Content'}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {assignment.current_phase === 'review' && (
                    <div className="border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card">
                      <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <FiClock className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Under Review</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Your content has been submitted and is currently under review by the brand.
                      </p>
                    </div>
                  )}

                  {assignment.current_phase === 'approved' && (
                    <div className="border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card">
                      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FiCheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Content Approved!</h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                        Your content has been approved. Please post it to your social media and submit the live URL below.
                      </p>
                      <div className="flex gap-2 w-full max-w-md">
                        <Input 
                          placeholder="https://instagram.com/p/..." 
                          value={liveUrlInput}
                          onChange={(e) => setLiveUrlInput(e.target.value)}
                        />
                        <Button onClick={handleSubmitLiveUrl} disabled={!liveUrlInput.trim() || isSubmittingLiveUrl}>
                          {isSubmittingLiveUrl ? 'Submitting...' : 'Submit Link'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {(assignment.current_phase === 'live' || assignment.current_phase === 'completed') && (
                    <div className="border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card">
                      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FiCheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Live Post Submitted</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        {assignment.current_phase === 'completed' 
                          ? "This assignment has been marked as completed. Great job!" 
                          : "Your live post link has been submitted and the brand will mark the assignment as completed soon."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {contents && contents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contents.map((content: any) => {
                    const isImageUrl = content.media_url?.startsWith('http') || content.media_url?.startsWith('blob');
                    return (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        key={content.id} 
                        className="border rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <div className="aspect-video relative bg-muted flex items-center justify-center">
                          {isImageUrl ? (
                            <img src={content.media_url} alt="Content thumbnail" className="w-full h-full object-cover" onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              e.currentTarget.parentElement?.classList.add('flex', 'flex-col');
                              const text = document.createElement('p');
                              text.className = 'text-sm font-medium px-4 text-center mt-2';
                              text.innerText = content.media_url;
                              e.currentTarget.parentElement?.appendChild(text);
                            }} />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
                              <FiFileText className="h-10 w-10 mb-2 opacity-50" />
                              <p className="text-sm font-medium break-all">{content.media_url}</p>
                              <p className="text-xs opacity-70 mt-1">Uploaded File</p>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant={content.status === 'approved' ? 'default' : content.status === 'changes_requested' ? 'destructive' : 'secondary'} className="capitalize backdrop-blur-md bg-background/80">
                              {content.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      
                      {isBrand && content.status === 'pending_review' && (
                        <div className="p-3 bg-muted/30 border-t flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReviewContent(content.id, "changes_requested")}>
                            <FiX className="mr-2 h-4 w-4" /> Request Changes
                          </Button>
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleReviewContent(content.id, "approved")}>
                            <FiCheck className="mr-2 h-4 w-4" /> Approve
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                </div>
              ) : (
                <EmptyState 
                  icon={<FiImage className="h-8 w-8" />}
                  title="No content submitted"
                  description="Content drafts will appear here once submitted."
                  className="min-h-[200px] border-none shadow-none bg-muted/20"
                />
              )}

              {isBrand && assignment && (assignment.current_phase === 'live' || assignment.current_phase === 'completed') && (
                <div className="mt-8 border rounded-xl p-6 bg-secondary/20">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <FiCheckCircle className="text-green-600" /> Live Post Submitted
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Live URL:</p>
                      <a href={assignment.live_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">
                        {assignment.live_url || "Link not available"}
                      </a>
                    </div>
                    {assignment.current_phase === 'live' && (
                      <Button onClick={() => handleUpdatePhase('completed')} disabled={isUpdatingPhase} className="w-full sm:w-auto self-start bg-green-600 hover:bg-green-700">
                        {isUpdatingPhase ? 'Marking Complete...' : 'Mark Assignment Completed'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
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
              {campaign.status_logs && campaign.status_logs.length > 0 ? (
                <div className="relative pl-4 border-l space-y-6 ml-2">
                  {campaign.status_logs.map((log: any) => (
                    <div key={log.id} className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary"></span>
                      <p className="text-sm font-medium leading-tight">{log.note || `Status changed to ${log.to_status}`}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
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

        {/* Right Column: Deliverables */}
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
                {campaign.deliverables && campaign.deliverables.map((del: any) => (
                  <div 
                    key={del.id} 
                    className={`flex items-start gap-3 p-3 border rounded-xl bg-card transition-colors ${assignment ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                    onClick={() => assignment && handleToggleDeliverable(del.id)}
                  >
                    <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${del.is_completed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                      {del.is_completed ? <FiCheckCircle className="h-4 w-4" /> : <FiClock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${del.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {del.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {del.is_completed ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
                {!campaign.deliverables?.length && (
                  <p className="text-sm text-muted-foreground">No deliverables set.</p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      
      {/* Alert Dialog */}
      <Dialog open={alertState.isOpen} onOpenChange={(isOpen) => setAlertState(prev => ({...prev, isOpen}))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${alertState.isError ? 'text-red-600' : 'text-green-600'}`}>
              {alertState.isError ? <FiAlertCircle className="h-5 w-5" /> : <FiCheckCircle className="h-5 w-5" />}
              {alertState.title}
            </DialogTitle>
            <DialogDescription className="pt-2 text-base text-foreground">
              {alertState.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setAlertState(prev => ({...prev, isOpen: false}))}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
