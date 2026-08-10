
import { cn } from "@/lib/utils"

export function MeshBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none select-none z-0", className)}>
      {/* Primary Blob */}
      <div className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vh] md:w-[60vw] md:h-[60vh] rounded-full blur-[120px] bg-primary/10 animate-blob-morph" />
      
      {/* Secondary Blob */}
      <div className="absolute top-[30%] -right-[15%] w-[70vw] h-[70vh] md:w-[50vw] md:h-[50vh] rounded-full blur-[100px] bg-primary/5 animate-blob-morph-delayed" />
      
      {/* Center ambient glow */}
      <div className="absolute bottom-[-10%] left-[20%] w-[90vw] h-[60vh] md:w-[70vw] md:h-[40vh] rounded-full blur-[140px] bg-primary/10 animate-blob-morph" style={{ animationDelay: '-10s' }} />
    </div>
  )
}
