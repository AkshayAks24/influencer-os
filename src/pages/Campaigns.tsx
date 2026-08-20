import { useCampaigns } from "@/contexts/CampaignsContext"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiActivity, FiChevronRight, FiFolder, FiPlus } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/common/EmptyState"
import { Skeleton } from "@/components/common/Skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal"

export function Campaigns() {
  const { campaigns, isLoading } = useCampaigns()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const filteredCampaigns = campaigns.filter(campaign => {
    // If the backend doesn't have is_public yet, we assume it's public unless specified otherwise
    const isPublic = campaign.is_public !== false; 
    if (currentUser?.role === 'brand') {
      return isPublic || campaign.brand_id === currentUser.id || campaign.brand?.id === currentUser.id;
    }
    // Influencers see public campaigns
    return isPublic;
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'active': return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'completed': return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
      case 'open': return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  return (
    <div className="max-w-7xl mx-auto pb-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            {currentUser?.role === 'brand' ? 'Manage your campaigns and track their progress.' : 'Explore and manage your campaign participations.'}
          </p>
        </div>
        {currentUser?.role === 'brand' && (
          <Button onClick={() => setIsCreateOpen(true)} className="shrink-0">
            <FiPlus className="mr-2 h-4 w-4" /> Create New
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={<FiFolder className="h-12 w-12" />}
          title="No campaigns found"
          description={currentUser?.role === 'brand' ? "You haven't created any campaigns yet. Start your first campaign to connect with influencers." : "You haven't participated in any campaigns yet."}
          actionText={currentUser?.role === 'brand' ? "Go to Dashboard" : "Find Campaigns"}
          onAction={() => navigate(currentUser?.role === 'brand' ? "/brand/dashboard" : "/discovery")}
          className="min-h-[400px]"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={campaign.id}
            >
              <Card 
                className="overflow-hidden hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full flex flex-col"
                onClick={() => navigate(`/campaign/${campaign.id}`)}
              >
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FiActivity className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className={`${getStatusColor(campaign.status)} capitalize`}>
                      {campaign.status === 'in_progress' ? 'Active' : campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="font-bold text-lg line-clamp-1">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {campaign.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-semibold">${(campaign.budget / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Deliverables</span>
                      <span className="font-medium">{campaign.deliverables?.length || 0} items</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-3 border-t">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="font-medium">
                        {new Date(campaign.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - 
                        {new Date(campaign.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {currentUser?.role === 'brand' && (
        <CreateCampaignModal isOpen={isCreateOpen} onClose={setIsCreateOpen} />
      )}
    </div>
  )
}
