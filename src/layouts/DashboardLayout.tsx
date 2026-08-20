import { useState, useRef, useEffect } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { FiMenu, FiX, FiHome, FiSearch, FiSettings, FiBell, FiMessageSquare, FiLogOut, FiChevronDown, FiUser, FiFolder } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationsContext"

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { unreadCount } = useNotifications()
  
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navItems = [
    {
      name: "Dashboard",
      path: currentUser?.role === "brand" ? "/brand/dashboard" : "/influencer/dashboard",
      icon: <FiHome className="h-5 w-5" />,
      showFor: ["brand", "influencer"]
    },
    {
      name: "Discovery",
      path: "/discovery",
      icon: <FiSearch className="h-5 w-5" />,
      showFor: ["brand"]
    },
    {
      name: "Campaigns",
      path: "/campaigns",
      icon: <FiFolder className="h-5 w-5" />,
      showFor: ["brand", "influencer"]
    },
    {
      name: "Chat",
      path: "/chat",
      icon: <FiMessageSquare className="h-5 w-5" />,
      showFor: ["brand", "influencer"]
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FiSettings className="h-5 w-5" />,
      showFor: ["brand", "influencer"]
    }
  ]

  const visibleNavItems = navItems.filter(item => item.showFor.includes(currentUser?.role || ""))

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
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
          <Link 
            to={currentUser?.role === "brand" ? "/brand/dashboard" : "/influencer/dashboard"} 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="flex items-center space-x-2"
          >
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
        <div data-lenis-prevent="true" className="p-4 flex-1 overflow-y-auto space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b bg-card flex items-center px-4 md:px-6 shrink-0 gap-4 justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FiMenu className="h-5 w-5" />
            </Button>
            <div className="text-sm font-medium capitalize hidden sm:block">
              {location.pathname.split('/').filter(Boolean)[0] || 'Dashboard'}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/notifications" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground relative"
            >
              <FiBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Link>
            
            <div className="relative" ref={profileRef}>
              <button 
                className="flex items-center gap-2 hover:bg-primary/10 p-1.5 rounded-md transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.charAt(0) || <FiUser />}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:block">{currentUser?.name}</span>
                <FiChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium truncate">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                  </div>
                  <Link 
                    to={`/profile/${currentUser?.id || "me"}`} 
                    onClick={() => {
                      setIsProfileOpen(false)
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                  >
                    <FiUser className="h-4 w-4" /> Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => {
                      setIsProfileOpen(false)
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                  >
                    <FiSettings className="h-4 w-4" /> Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <FiLogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main id="main-scroll-container" data-lenis-prevent="true" className="flex-1 overflow-y-auto p-4 md:p-6 bg-background relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
