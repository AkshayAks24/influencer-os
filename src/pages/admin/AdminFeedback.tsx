import { useState } from "react";
import adminData from "@/data/admin.json";

export function AdminFeedback() {
  const [search, setSearch] = useState("");
  const feedbackItems = adminData.feedback;

  const filteredFeedback = feedbackItems.filter(f => 
    f.influencer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Influencer Feedback</h1>
          <p className="text-slate-500 mt-1">Review feedback on AI recommendations to improve the processing pipeline.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by influencer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Influencer</th>
              <th className="px-6 py-4">Recommendation</th>
              <th className="px-6 py-4">Feedback</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredFeedback.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{f.influencer}</td>
                <td className="px-6 py-4">{f.recommendation}</td>
                <td className="px-6 py-4">
                  {f.feedback === 'Positive' ? (
                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                      👍 Positive
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-700 font-medium bg-rose-50 px-2.5 py-1 rounded-full w-fit">
                      👎 Negative
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-700 italic">{f.reason}</span>
                </td>
                <td className="px-6 py-4 text-xs">{f.date}</td>
              </tr>
            ))}
            {filteredFeedback.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No feedback found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
