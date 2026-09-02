import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { HiOutlineHome, HiOutlineSparkles } from "react-icons/hi2";
import { HiOutlineSearch, HiOutlineUser } from "react-icons/hi";

const navItems = [
  { to: "/", icon: HiOutlineHome, label: "Home" },
  { to: "/discover", icon: HiOutlineSearch, label: "Discover" },
  { to: "/ideas", icon: HiOutlineSparkles, label: "Ideas" },
  { to: "/profile", icon: HiOutlineUser, label: "Profile" },
];

export function PulseLayout() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="pulse-theme min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-pulse-bg/80 backdrop-blur-xl border-b border-pulse-border">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pulse-text flex items-center justify-center">
              <span className="text-pulse-white text-sm font-bold font-heading">P</span>
            </div>
            <span className="text-base font-heading font-bold text-pulse-text hidden sm:inline">
              Creator Pulse
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <>
                <span className="text-sm font-body text-pulse-muted hidden sm:inline">
                  {currentUser.name}
                </span>
                <button
                  onClick={logout}
                  className="w-8 h-8 rounded-full bg-pulse-elevated border border-pulse-border flex items-center justify-center text-pulse-text font-heading font-bold text-xs hover:bg-pulse-border transition-colors"
                  title="Logout"
                >
                  {currentUser.name?.charAt(0).toUpperCase() || "U"}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-2">
        <Outlet />
      </main>

      {/* Bottom navigation — mobile & tablet */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-pulse-white/80 backdrop-blur-xl border-t border-pulse-border lg:hidden">
        <div className="max-w-[680px] mx-auto px-4 flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
                  isActive ? "text-pulse-text" : "text-pulse-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <item.icon className="w-6 h-6" />
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pulse-lime"
                        layoutId="nav-indicator"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-heading font-semibold">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Side navigation — desktop */}
      <nav className="hidden lg:flex fixed left-0 top-14 bottom-0 w-16 bg-pulse-bg border-r border-pulse-border flex-col items-center pt-6 gap-2 z-40">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 p-2.5 rounded-xl transition-colors ${
                isActive
                  ? "text-pulse-text bg-pulse-elevated"
                  : "text-pulse-muted hover:text-pulse-text hover:bg-pulse-elevated/50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-heading font-semibold">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-pulse-lime"
                    layoutId="sidebar-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
