import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FiCheckCircle, FiPlus, FiX } from "react-icons/fi"
import apiClient from "@/lib/apiClient"
import { useAuth } from "@/contexts/AuthContext"
import { useCampaigns } from "@/contexts/CampaignsContext"

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
}

export function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
  const { currentUser } = useAuth()
  const { fetchCampaigns } = useCampaigns()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "New campaign description",
    category: "General",
    budget: "",
    startDate: "",
    endDate: "",
    deliverables: [""],
    isPublic: true
  })

  const handleAddDeliverable = () => setFormData(prev => ({ ...prev, deliverables: [...prev.deliverables, ""] }))
  
  const handleRemoveDeliverable = (index: number) => setFormData(prev => ({ ...prev, deliverables: prev.deliverables.filter((_, i) => i !== index) }))
  
  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables]
    newDeliverables[index] = value
    setFormData(prev => ({ ...prev, deliverables: newDeliverables }))
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const campaignPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: parseInt(formData.budget) || 0,
        start_date: formData.startDate,
        end_date: formData.endDate,
        is_public: formData.isPublic
      }
      const response = await apiClient.post('/campaigns', campaignPayload)
      const campaignId = response.data.id

      const validDeliverables = formData.deliverables.filter(d => d.trim() !== "")
      for (const deliverableDesc of validDeliverables) {
        await apiClient.post(`/campaigns/${campaignId}/deliverables`, {
          description: deliverableDesc
        })
      }

      setShowSuccess(true)
      await fetchCampaigns()
      
      setTimeout(() => {
        setShowSuccess(false)
        onClose(false)
        setFormData({ title: "", description: "New campaign description", category: "General", budget: "", startDate: "", endDate: "", deliverables: [""], isPublic: true })
      }, 1500)
    } catch (error) {
      console.error("Failed to create campaign", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                <div className="relative">
                  <Input 
                    id="startDate" 
                    type="date" 
                    required 
                    value={formData.startDate} 
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Input 
                    id="endDate" 
                    type="date" 
                    required 
                    value={formData.endDate} 
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Deliverables</Label>
                <Button type="button" variant="ghost" size="sm" onClick={handleAddDeliverable} className="h-8">
                  <FiPlus className="mr-1 h-4 w-4" /> Add Row
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={deliverable} 
                      onChange={(e) => handleDeliverableChange(index, e.target.value)}
                      placeholder="e.g. 1x Dedicated YouTube Video"
                      required
                    />
                    {formData.deliverables.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveDeliverable(index)}>
                        <FiX className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="isPublic" 
                checked={formData.isPublic}
                onChange={e => setFormData({...formData, isPublic: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isPublic" className="font-normal cursor-pointer">
                Make this campaign publicly visible to influencers and other brands
              </Label>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => onClose(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
