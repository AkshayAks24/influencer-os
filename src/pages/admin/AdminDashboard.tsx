import { Link } from "react-router-dom";
import adminData from "@/data/admin.json";

export function AdminDashboard() {
  const stats = adminData.stats;

  const statCards = [
    { label: "Influencers", value: stats.totalInfluencers, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Researching", value: stats.researching, color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Trends", value: stats.trends, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "AI Processing", value: stats.aiProcessing, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { label: "Reports", value: stats.reports, color: "bg-rose-50 text-rose-700 border-rose-200" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your Trend Intelligence platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className={`rounded-xl border p-5 ${stat.color}`}>
            <p className="text-sm font-semibold opacity-80">{stat.label}</p>
            <p className="text-3xl font-bold font-heading mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions or Recent Activity could go here in the future */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 font-heading">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            to="/admin/influencers"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Manage Influencers
          </Link>
          <Link
            to="/admin/research"
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Add New Trend
          </Link>
        </div>
      </div>
    </div>
  );
}
