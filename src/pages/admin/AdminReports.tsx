import { useState } from "react";
import adminData from "@/data/admin.json";
import { HiX } from "react-icons/hi";

export function AdminReports() {
  const [search, setSearch] = useState("");
  const [publishId, setPublishId] = useState<string | null>(null);
  const reports = adminData.reports;

  const filteredReports = reports.filter(r => 
    r.influencer.toLowerCase().includes(search.toLowerCase()) || 
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Reports</h1>
          <p className="text-slate-500 mt-1">Manage Trend Intelligence reports generated for influencers.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by influencer or report ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Report ID</th>
              <th className="px-6 py-4">Influencer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Opportunities</th>
              <th className="px-6 py-4">Emerging Trends</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReports.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{r.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{r.influencer}</td>
                <td className="px-6 py-4">{r.date}</td>
                <td className="px-6 py-4">{r.opportunities}</td>
                <td className="px-6 py-4">{r.emergingTrends}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                    ${r.status === 'Ready' ? 'bg-amber-100 text-amber-800' : ''}
                    ${r.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : ''}
                    ${r.status === 'Failed' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  {(r.status === 'Ready' || r.status === 'Published') && (
                    <>
                      <button 
                        onClick={() => alert(`Viewing report ${r.id}`)}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => alert(`Downloading report ${r.id}`)}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        Download
                      </button>
                    </>
                  )}
                  {r.status === 'Ready' && !r.published && (
                    <button 
                      onClick={() => setPublishId(r.id)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors font-bold"
                    >
                      Publish
                    </button>
                  )}
                  {r.status === 'Failed' && (
                    <span className="text-xs text-slate-400">No actions</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredReports.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No reports found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Publish Modal */}
      {publishId && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-heading font-bold text-lg text-slate-900">Publish Report</h3>
              <button onClick={() => setPublishId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Give permission for AI to start the process and give a processed report for this creator?
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setPublishId(null)} className="px-5 py-2 bg-white border border-gray-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => setPublishId(null)} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
