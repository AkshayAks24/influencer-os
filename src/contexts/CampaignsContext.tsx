import { createContext, useContext, useState, type ReactNode } from "react"
import type { Campaign } from "@/types"
import campaignsData from "@/data/campaigns.json"

interface CampaignsContextType {
  campaigns: Campaign[]
  addCampaign: (campaign: Campaign) => void
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined)

export function CampaignsProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(campaignsData as unknown as Campaign[])

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev])
  }

  return (
    <CampaignsContext.Provider value={{ campaigns, addCampaign }}>
      {children}
    </CampaignsContext.Provider>
  )
}

export function useCampaigns() {
  const context = useContext(CampaignsContext)
  if (context === undefined) {
    throw new Error("useCampaigns must be used within a CampaignsProvider")
  }
  return context
}
