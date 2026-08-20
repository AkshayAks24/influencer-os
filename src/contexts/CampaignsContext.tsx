import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import apiClient from "@/lib/apiClient"

interface CampaignsContextType {
  campaigns: any[]
  isLoading: boolean
  fetchCampaigns: () => Promise<void>
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined)

export function CampaignsProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCampaigns = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get('/campaigns', { params: { limit: 100 } })
      setCampaigns(response.data.items || [])
    } catch (error) {
      console.error("Failed to fetch campaigns", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load campaigns initially
  useEffect(() => {
    fetchCampaigns()
  }, [])

  return (
    <CampaignsContext.Provider value={{ campaigns, isLoading, fetchCampaigns }}>
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
