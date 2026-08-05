import { Navbar } from "@/components/common/Navbar"
import { Footer } from "@/components/common/Footer"
import { Hero } from "@/components/landing/Hero"
import { ProductOverview } from "@/components/landing/ProductOverview"
import { ProblemsSolutions } from "@/components/landing/ProblemsSolutions"
import { FeatureHighlights } from "@/components/landing/FeatureHighlights"
import { PricingPreview } from "@/components/landing/PricingPreview"
import { Testimonials } from "@/components/landing/Testimonials"
import { FAQ } from "@/components/landing/FAQ"

// Import Mock Data
import landingDataRaw from "@/data/landing.json"
import pricingDataRaw from "@/data/pricing.json"
import testimonialsDataRaw from "@/data/testimonials.json"

import type { LandingData, PricingPlan, Testimonial } from "@/types"

const landingData = landingDataRaw as LandingData
const pricingData = pricingDataRaw as PricingPlan[]
const testimonialsData = testimonialsDataRaw as Testimonial[]

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      <Navbar />
      
      <main className="flex-1">
        <Hero data={landingData.hero} />
        <ProductOverview data={landingData.productOverview} />
        <ProblemsSolutions data={landingData.problemsSolutions} />
        <FeatureHighlights data={landingData.features} />
        <Testimonials data={testimonialsData} />
        <PricingPreview data={pricingData} />
        <FAQ data={landingData.faq} />
      </main>

      <Footer />
    </div>
  )
}
