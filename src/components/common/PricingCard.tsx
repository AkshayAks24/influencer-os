import { motion } from "framer-motion"
import { FiCheck } from "react-icons/fi"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { PricingPlan } from "@/types"

export interface PricingCardProps {
  plan: PricingPlan
  isAnnual?: boolean
  index?: number // For staggered animation delay
}

export function PricingCard({ plan, isAnnual = false, index = 0 }: PricingCardProps) {
  const displayPrice = isAnnual ? plan.price * 10 : plan.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
      className="flex h-full w-full"
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
}
