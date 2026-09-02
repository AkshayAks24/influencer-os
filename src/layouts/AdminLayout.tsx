import { Outlet, NavLink } from "react-router-dom";
import { 
  HiOutlineHome, 
  HiOutlineUsers, 
  HiOutlineSearchCircle, 
  HiOutlineCollection, 
  HiOutlineChip, 
  HiOutlineDocumentReport, 
  HiOutlineChatAlt2 
} from "react-icons/hi";

const navItems = [
  { to: "/admin", icon: HiOutlineHome, label: "Dashboard", end: true },
  { to: "/admin/influencers", icon: HiOutlineUsers, label: "Influencers" },
  { to: "/admin/research", icon: HiOutlineSearchCircle, label: "Trend Research" },
  { to: "/admin/library", icon: HiOutlineCollection, label: "Trend Library" },
  { to: "/admin/ai-processing", icon: HiOutlineChip, label: "AI Processing" },
  { to: "/admin/reports", icon: HiOutlineDocumentReport, label: "Reports" },
  { to: "/admin/feedback", icon: HiOutlineChatAlt2, label: "Feedback" },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex font-body text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold font-heading">P</span>
          </div>
          <span className="font-heading font-bold text-slate-900 text-lg">Admin Workspace</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-gray-50 hover:text-slate-900"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Admin User</p>
              <p className="text-xs text-slate-500">Research Team</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
