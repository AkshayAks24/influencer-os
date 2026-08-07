import { useState } from "react"
import { motion } from "framer-motion"
import { FiCheck } from "react-icons/fi"

import { Navbar } from "@/components/common/Navbar"
import { Footer } from "@/components/common/Footer"
import { FAQ } from "@/components/common/FAQ"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/common/EmptyState"

import pricingDataRaw from "@/data/pricing.json"
import landingDataRaw from "@/data/landing.json"
import type { PricingPlan, LandingData } from "@/types"

const pricingData = pricingDataRaw as PricingPlan[]
const landingData = landingDataRaw as LandingData

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  // Empty state guard for robust future API integration
  if (!pricingData || pricingData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto py-24 px-4">
          <EmptyState
            title="No Pricing Plans Available"
            description="We're currently updating our pricing tiers. Please check back later."
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      <Navbar />
      
      <main className="flex-1">
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
              {pricingData.map((plan, index) => {
                const displayPrice = isAnnual ? plan.price * 10 : plan.price;
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    className="flex h-full"
                  >
                    <Card 
                      className={`relative flex flex-col w-full h-full transition-all duration-300 hover:-translate-y-1 ${
                        plan.highlighted 
                          ? "border-primary shadow-xl hover:shadow-2xl hover:shadow-primary/20 scale-105 z-10" 
                          : "border-border shadow-sm hover:shadow-lg hover:border-primary/50"
                      }`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-4 left-0 right-0 flex justify-center">
                          <Badge className="bg-primary text-primary-foreground font-bold px-4 py-1.5 uppercase tracking-wider text-xs shadow-md">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pb-8">
                        <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                        <CardDescription>
                          <span className="text-5xl font-bold text-foreground">${displayPrice}</span>
                          <span className="text-muted-foreground font-medium ml-1">/{isAnnual ? 'yr' : 'mo'}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <ul className="space-y-4 text-sm text-muted-foreground">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <FiCheck className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className={`w-full font-semibold h-12 transition-all ${
                            plan.highlighted ? "shadow-md hover:shadow-lg" : ""
                          }`} 
                          variant={plan.highlighted ? "default" : "outline"}
                          size="lg"
                        >
                          Get Started
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <div className="bg-secondary/30">
          <FAQ data={landingData.faq} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
