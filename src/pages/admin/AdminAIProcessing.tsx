import { useState } from "react";
import adminData from "@/data/admin.json";
import { HiX } from "react-icons/hi";

export function AdminAIProcessing() {
  const processes = adminData.aiProcessing;
  const recommendations = adminData.aiRecommendations as any;
  const [inspectId, setInspectId] = useState<string | null>(null);
  const [addDataId, setAddDataId] = useState<string | null>(null);

  const handleRetry = (id: string) => {
    alert(`Retrying job ID: ${id}`);
  };

  const inspectedRec = inspectId ? recommendations[inspectId] || recommendations["1"] : null; // Fallback to 1 for mock

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">AI Processing Pipeline</h1>
          <p className="text-slate-500 mt-1">Monitor recommendation generation and AI profile processing.</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Influencer</th>
              <th className="px-6 py-4">Processing Type</th>
              <th className="px-6 py-4">Started</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Completed</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {processes.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{p.influencer}</td>
                <td className="px-6 py-4">{p.type}</td>
                <td className="px-6 py-4 text-xs">{p.started}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {p.status === 'Processing' && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                    {p.status === 'Failed' && (
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                    {p.status === 'Ready' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                    <span className={`font-medium
                      ${p.status === 'Processing' ? 'text-blue-700' : ''}
                      ${p.status === 'Ready' ? 'text-emerald-700' : ''}
                      ${p.status === 'Failed' ? 'text-red-700' : ''}
                    `}>
                      {p.status}
                    </span>
                  </div>
                  {p.error && (
                     <p className="text-xs text-red-500 mt-1">{p.error}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-xs">{p.completed}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  {p.status === 'Failed' && (
                    <button 
                      onClick={() => handleRetry(p.id)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                    >
                      Retry
                    </button>
                  )}
                  {p.status === 'Processing' && (
                    <>
                      <button 
                        onClick={() => alert(`Applying research for ${p.id}`)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                      >
                        Apply Research
                      </button>
                      <button 
                        onClick={() => setAddDataId(p.id)}
                        className="text-xs font-medium text-slate-600 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded transition-colors"
                      >
                        Add Data
                      </button>
                    </>
                  )}
                  {p.status === 'Ready' && (
                    <button 
                      onClick={() => setInspectId(p.id)}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                    >
                      Inspect
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspect Modal */}
      {inspectId && inspectedRec && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-heading font-bold text-lg text-slate-900">AI Recommendation Result</h3>
              <button onClick={() => setInspectId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Trend</p>
                  <p className="text-sm font-medium text-slate-900">{inspectedRec.trend}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Relevance Match</p>
                  <p className="text-sm font-bold text-emerald-600">{inspectedRec.match}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Format</p>
                  <p className="text-sm font-medium text-slate-900">{inspectedRec.format}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Angle</p>
                  <p className="text-sm font-medium text-slate-900">{inspectedRec.angle}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hook</p>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                  <p className="text-sm font-medium text-indigo-900 italic">"{inspectedRec.hook}"</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Content Idea</p>
                <p className="text-sm text-slate-700 leading-relaxed">{inspectedRec.contentIdea}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Difficulty</p>
                  <p className="text-sm text-slate-700">{inspectedRec.difficulty}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Potential Upside</p>
                  <p className="text-sm text-emerald-600 font-medium">{inspectedRec.upside}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Risk</p>
                  <p className="text-sm text-amber-600 font-medium">{inspectedRec.risk}</p>
                </div>
              </div>

            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setInspectId(null)} className="px-5 py-2 bg-white border border-gray-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Data Modal */}
      {addDataId && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-heading font-bold text-lg text-slate-900">Add Processed Data</h3>
              <button onClick={() => setAddDataId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Paste the processed data or upload a file. The AI will convert this into the final Trend Intelligence Report.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paste Data</label>
                <textarea 
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                  placeholder="Paste JSON or text data here..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload File</label>
                <input 
                  type="file" 
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 transition-colors cursor-pointer"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setAddDataId(null)} className="px-5 py-2 bg-white border border-gray-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => setAddDataId(null)} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Submit Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
