import { useState, useEffect } from "react"
import { motion } from "framer-motion"


import { FAQ } from "@/components/common/FAQ"
import { PricingCard } from "@/components/common/PricingCard"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/common/EmptyState"
import apiClient from "@/lib/apiClient"

import landingDataRaw from "@/data/landing.json"
import type { PricingPlan, LandingData } from "@/types"

const landingData = landingDataRaw as LandingData

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [pricingData, setPricingData] = useState<PricingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await apiClient.get('/pricing-plans')
        setPricingData(response.data || [])
      } catch (error) {
        console.error("Failed to fetch pricing plans", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPricing()
  }, [])

  // Empty state guard for robust future API integration
  if (!isLoading && (!pricingData || pricingData.length === 0)) {
    return (
      <div className="container mx-auto py-24 px-4">
        <EmptyState
          title="No Pricing Plans Available"
          description="We're currently updating our pricing tiers. Please check back later."
        />
      </div>
    )
  }

  return (
    <>
      {/* Header Section */}
      <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center max-w-[800px] mx-auto">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-foreground"
              >
                Simple, transparent pricing
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed"
              >
                No hidden fees. No surprise charges. Choose the plan that scales with your brand.
              </motion.p>
              
              {/* Billing Toggle */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 flex items-center justify-center gap-3"
              >
                <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                  Monthly
                </span>
                
                <button
                  type="button"
                  className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  role="switch"
                  aria-checked={isAnnual}
                  onClick={() => setIsAnnual(!isAnnual)}
                >
                  <span className="sr-only">Toggle annual billing</span>
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-background shadow-md ring-0 ${
                      isAnnual ? "ml-5" : "ml-0"
                    }`}
                  />
                </button>
                
                <span className={`text-sm font-medium flex items-center ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                  Annually <Badge variant="success" className="ml-2 py-0 h-5 px-1.5 text-[10px]">2 MONTHS FREE</Badge>
                </span>
              </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {pricingData.map((plan, index) => (
                <PricingCard 
                  key={plan.id} 
                  plan={plan} 
                  isAnnual={isAnnual} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </section>

      {/* FAQ Section */}
      <div className="bg-secondary/30">
        <FAQ data={landingData.faq} />
      </div>
    </>
  )
}
