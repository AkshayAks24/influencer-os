import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import type { LandingHero } from "@/types"
import { HeroMockupComposition } from "./HeroMockupComposition"

export function Hero({ data }: { data: LandingHero }) {

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-[100%] blur-[120px] opacity-40 pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-30 pointer-events-none translate-y-1/4" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-6">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl/tight text-foreground tracking-tight">
                {data.headline}
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                {data.subheadline}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold h-12 px-8 shadow-[0_0_20px_rgba(214,168,90,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all hover:shadow-[0_0_30px_rgba(214,168,90,0.5)]" asChild>
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
            className="mx-auto w-full max-w-[600px] lg:max-w-none relative"
          >
            <HeroMockupComposition />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
