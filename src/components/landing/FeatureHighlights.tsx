import { motion } from "framer-motion"
import type { LandingFeature } from "@/types"
import * as Icons from "react-icons/fi"

export function FeatureHighlights({ data }: { data: LandingFeature[] }) {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center max-w-[800px] mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Built for scale and speed
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Everything you need to run high-ROI campaigns, neatly organized in one intuitive dashboard.
          </motion.p>
        </div>
        
        <div className="relative">
          {/* The Gold Backlight (CRITICAL) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-primary/10 blur-[120px] pointer-events-none -z-10" />
          
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((feature, index) => {
              // Dynamically get the icon component from react-icons/fi
              const IconName = feature.icon as keyof typeof Icons
              const Icon = Icons[IconName] || Icons.FiCheck
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative p-8 rounded-2xl bg-card border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 overflow-hidden"
                >
                {/* Soft radial gold glow utility in the background */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[40px] rounded-full group-hover:bg-primary/20 transition-colors" />
                
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-full bg-accent text-primary flex items-center justify-center mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  {/* Serif font for heading */}
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  {/* Muted slate for body text */}
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
        </div>
      </div>
    </section>
  )
}
