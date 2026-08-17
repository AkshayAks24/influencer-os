import { motion } from "framer-motion"
import { FiTrendingUp, FiCheckCircle, FiUser } from "react-icons/fi"

export function HeroMockupComposition() {
  return (
    <div className="relative w-full h-[500px] lg:h-[700px] flex items-center justify-center overflow-visible z-10" style={{ perspective: '1000px' }}>
      
      {/* Backlighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="relative w-full max-w-[500px] aspect-square" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Card 3: Payment Escrowed (Bottom Left, Closest) */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          className="absolute bottom-[10%] left-[5%] w-[280px] bg-card rounded-2xl p-5 border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl z-30 flex items-center gap-4"
          style={{ transform: 'rotateY(-15deg) rotateX(10deg) translateZ(80px)' }}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
            <FiCheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Payment Escrowed</p>
            <p className="text-lg font-bold text-success">$12,500.00</p>
          </div>
        </motion.div>

        {/* Card 2: Main ROI Chart (Center, Middle Z) */}
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] left-[15%] w-[320px] bg-card rounded-2xl p-6 border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl z-20"
          style={{ transform: 'rotateY(-10deg) rotateX(5deg) translateZ(40px)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Campaign ROI</p>
              <p className="text-2xl font-bold text-foreground">+324%</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <FiTrendingUp className="h-5 w-5" />
            </div>
          </div>
          
          {/* Minimal Mock Chart */}
          <div className="h-24 w-full flex items-end justify-between gap-2">
            {[30, 45, 25, 60, 50, 80, 100].map((height, i) => (
              <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group overflow-hidden" style={{ height: `${height}%` }}>
                <div className="absolute bottom-0 left-0 right-0 bg-primary w-full transition-all duration-500 rounded-t-sm group-hover:h-full" style={{ height: i === 6 ? '100%' : '20%' }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 1: Creator Match (Top Right, Furthest) */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[5%] right-[5%] w-[260px] bg-card rounded-2xl p-5 border-none shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl z-10"
          style={{ transform: 'rotateY(-5deg) rotateX(15deg) translateZ(-20px)' }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-primary-foreground shadow-lg">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Creator Match</p>
              <p className="text-xs text-muted-foreground">AI Analysis Complete</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Relevance</span>
              <span className="font-bold text-primary">98%</span>
            </div>
            <div className="h-2 w-full bg-background rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-primary rounded-full w-[98%] shadow-[0_0_10px_rgba(214,168,90,0.5)]" />
            </div>
          </div>
        </motion.div>

        {/* Floating Accent Elements */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -top-4 right-[20%] h-16 w-16 bg-gradient-to-br from-primary/30 to-transparent rounded-2xl backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-primary/20 -z-10"
          style={{ transform: 'rotateY(10deg) translateZ(-50px)' }}
        />
        
      </div>
    </div>
  )
}
