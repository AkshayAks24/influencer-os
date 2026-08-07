import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-xl leading-none">I</span>
            </div>
            <span className="inline-block font-bold">InfluencerOS</span>
          </Link>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-sm text-muted-foreground p-2">Sidebar — coming soon</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar Placeholder */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="text-sm font-medium">Dashboard</div>
          <div className="text-sm text-muted-foreground">Top bar — coming soon</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-secondary/20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
