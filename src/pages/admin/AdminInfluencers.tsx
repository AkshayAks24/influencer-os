import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminData from "@/data/admin.json";

export function AdminInfluencers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [goalFilter, setGoalFilter] = useState("all");

  const influencers = adminData.influencers.filter((inf) => {
    const matchesSearch = inf.name.toLowerCase().includes(search.toLowerCase()) || 
                          inf.niche.toLowerCase().includes(search.toLowerCase());
    const matchesNiche = nicheFilter === "all" || inf.niche === nicheFilter;
    const matchesGoal = goalFilter === "all" || inf.goal === goalFilter;
    return matchesSearch && matchesNiche && matchesGoal;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Influencers</h1>
          <p className="text-slate-500 mt-1">Manage and review creator profiles.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name or niche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
        <select
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="all">All Niches</option>
          <option value="Technology">Technology</option>
          <option value="Fitness">Fitness</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Programming">Programming</option>
          <option value="Food">Food</option>
        </select>
        <select
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="all">All Goals</option>
          <option value="Grow followers">Grow followers</option>
          <option value="Brand deals">Brand deals</option>
          <option value="Increase engagement">Increase engagement</option>
          <option value="Personal brand">Personal brand</option>
          <option value="More views">More views</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Niche</th>
              <th className="px-6 py-4">Platform</th>
              <th className="px-6 py-4">Goal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {influencers.map((inf) => (
              <tr 
                key={inf.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/influencers/${inf.id}`)}
              >
                <td className="px-6 py-4 font-medium text-slate-900">{inf.name}</td>
                <td className="px-6 py-4">{inf.niche}</td>
                <td className="px-6 py-4">{inf.platform}</td>
                <td className="px-6 py-4">{inf.goal}</td>
              </tr>
            ))}
            {influencers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No influencers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
