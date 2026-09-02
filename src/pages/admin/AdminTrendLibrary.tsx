import { useState } from "react";
import adminData from "@/data/admin.json";
import { HiX } from "react-icons/hi";

export function AdminTrendLibrary() {
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [selectedTrend, setSelectedTrend] = useState<any>(null);

  const trends = adminData.trends.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesNiche = nicheFilter === "all" || t.niche.toLowerCase() === nicheFilter.toLowerCase();
    return matchesSearch && matchesNiche;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Trend Library</h1>
          <p className="text-slate-500 mt-1">Browse, search, and manage researched trends.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search trends by name..."
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
          <option value="technology">Technology</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="fitness">Fitness</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Trend Name</th>
              <th className="px-6 py-4">Niche</th>
              <th className="px-6 py-4">Stage</th>
              <th className="px-6 py-4">Platforms</th>
              <th className="px-6 py-4">Strength</th>
              <th className="px-6 py-4">Date Added</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trends.map((t) => (
              <tr 
                key={t.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setSelectedTrend(t)}
              >
                <td className="px-6 py-4 font-medium text-slate-900">{t.name}</td>
                <td className="px-6 py-4">{t.niche}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {t.stage}
                  </span>
                </td>
                <td className="px-6 py-4">{t.platforms}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${t.strength}%` }} />
                    </div>
                    <span className="text-xs">{t.strength}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">{t.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                    ${t.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}
                  `}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
            {trends.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No trends found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Trend Details Modal */}
      {selectedTrend && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="font-heading font-bold text-xl text-slate-900">Trend Insights: {selectedTrend.name}</h3>
              <button onClick={() => setSelectedTrend(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Stage</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedTrend.stage}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Strength</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-600">{selectedTrend.strength}/100</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Growth</p>
                  <p className="text-sm font-semibold text-indigo-600">{selectedTrend.growthRate || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize
                    ${selectedTrend.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'}
                  `}>
                    {selectedTrend.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Trend Overview</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                  {selectedTrend.description || 'Detailed description not available.'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Core Demographics</h4>
                  <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm h-full">
                    <p className="text-sm text-slate-600">
                      {selectedTrend.demographics || 'Demographic data not available.'}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Top Platforms</h4>
                  <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm h-full flex flex-wrap gap-2">
                    {selectedTrend.platforms.split(', ').map((p: string) => (
                      <span key={p} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Content Examples</h4>
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm space-y-2">
                  {selectedTrend.examples ? (
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                      {selectedTrend.examples.map((ex: string, i: number) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No examples available.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Actionable Advice for Creators</h4>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                  <p className="text-sm text-amber-900 font-medium">
                    {selectedTrend.advice || 'General advice applies: be authentic and engage with your audience.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
              <button onClick={() => setSelectedTrend(null)} className="px-5 py-2 bg-white border border-gray-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
