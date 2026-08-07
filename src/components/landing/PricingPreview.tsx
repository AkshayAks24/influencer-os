import { motion } from "framer-motion"
import { PricingCard } from "@/components/common/PricingCard"
import type { PricingPlan } from "@/types"

export function PricingPreview({ data }: { data: PricingPlan[] }) {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center max-w-[800px] mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            No hidden fees. No surprise charges. Choose the plan that scales with your brand.
          </motion.p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {data.map((plan, index) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
