import { useState } from "react"
import { Outlet, Link } from "react-router-dom"
import { FiMenu, FiX } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform flex-col border-r bg-card transition-transform duration-300 ease-in-out md:relative md:flex md:translate-x-0",
          isMobileMenuOpen ? "flex translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-xl leading-none">I</span>
            </div>
            <span className="inline-block font-bold">InfluencerOS</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden -mr-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiX className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-sm text-muted-foreground p-2">Sidebar — coming soon</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar Placeholder */}
        <header className="h-16 border-b bg-card flex items-center px-4 md:px-6 shrink-0 gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex justify-between items-center">
            <div className="text-sm font-medium">Dashboard</div>
            <div className="text-sm text-muted-foreground hidden sm:block">Top bar — coming soon</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary/20 relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
