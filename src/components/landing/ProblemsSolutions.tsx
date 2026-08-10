import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LandingProblemsSolutions } from "@/types"
import { FiXCircle, FiCheckCircle } from "react-icons/fi"

export function ProblemsSolutions({ data }: { data: LandingProblemsSolutions }) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full bg-card border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
              {/* Subtle Muted Red Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-destructive/5 blur-[50px] pointer-events-none rounded-full" />
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-destructive">
                  <FiXCircle className="mr-2 h-6 w-6" />
                  {data.problem.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {data.problem.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-destructive text-sm font-bold">
                        &times;
                      </span>
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full bg-card border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
              {/* Subtle Muted Green Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-success/5 blur-[50px] pointer-events-none rounded-full" />
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-success">
                  <FiCheckCircle className="mr-2 h-6 w-6" />
                  {data.solution.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {data.solution.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20 text-success text-sm font-bold">
                        ✓
                      </span>
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
