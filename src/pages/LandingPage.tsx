
import { Hero } from "@/components/landing/Hero"
import { ProductOverview } from "@/components/landing/ProductOverview"
import { ProblemsSolutions } from "@/components/landing/ProblemsSolutions"
import { FeatureHighlights } from "@/components/landing/FeatureHighlights"
import { PricingPreview } from "@/components/landing/PricingPreview"
import { Testimonials } from "@/components/landing/Testimonials"
import { FAQ } from "@/components/common/FAQ"

// Import Mock Data
import landingDataRaw from "@/data/landing.json"
import pricingDataRaw from "@/data/pricing.json"
import testimonialsDataRaw from "@/data/testimonials.json"

import type { LandingData, PricingPlan, Testimonial } from "@/types"

const landingData = landingDataRaw as LandingData
const pricingData = pricingDataRaw as PricingPlan[]
const testimonialsData = testimonialsDataRaw as Testimonial[]

import { MeshBackground } from "@/components/common/MeshBackground"

export function LandingPage() {
  return (
    <>
      <Hero data={landingData.hero} />
      
      {/* Sections Below Hero */}
      <div className="relative overflow-hidden bg-background">
        {/* Animated Mesh Background */}
        <MeshBackground />
        
        {/* Content Layer */}
        <div className="relative z-10">
          <ProductOverview data={landingData.productOverview} />
          <ProblemsSolutions data={landingData.problemsSolutions} />
          <FeatureHighlights data={landingData.features} />
          <Testimonials data={testimonialsData} />
          <PricingPreview data={pricingData} />
          <FAQ data={landingData.faq} />
        </div>
      </div>
    </>
  )
}
