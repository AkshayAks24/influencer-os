import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import type { LandingHero } from "@/types"

export function Hero({ data }: { data: LandingHero }) {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-foreground">
                {data.headline}
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                {data.subheadline}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold h-12 px-8" asChild>
                <Link to="/register">{data.ctaPrimary}</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold h-12 px-8" asChild>
                <Link to="/demo">{data.ctaSecondary}</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto w-full max-w-[500px] lg:max-w-none"
          >
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border bg-card shadow-2xl flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="text-center p-8">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg mb-6">
                  <span className="text-4xl font-bold text-primary-foreground">I</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">InfluencerOS Dashboard</h3>
                <p className="text-muted-foreground mt-2">Interactive Dashboard Preview</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
