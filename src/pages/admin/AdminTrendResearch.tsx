import { useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi";

interface EvidenceItem {
  id: string;
  creatorName: string;
  platform: string;
  url: string;
  views: string;
  engagement: string;
  percentageAboveAvg: string;
}

interface ContentAngle {
  id: string;
  angle: string;
  format: string;
}

export function AdminTrendResearch() {
  const [formData, setFormData] = useState({
    name: "",
    niche: "",
    stage: "Emerging",
    strength: 50,
    startDate: "",
    endDate: "",
    targetAudience: "",
    observedPattern: "",
  });

  const [platforms, setPlatforms] = useState<string[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [angles, setAngles] = useState<ContentAngle[]>([]);

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) {
      setPlatforms(platforms.filter(x => x !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const addEvidence = () => {
    setEvidenceList([
      ...evidenceList, 
      { id: Date.now().toString(), creatorName: "", platform: "TikTok", url: "", views: "", engagement: "", percentageAboveAvg: "" }
    ]);
  };

  const updateEvidence = (id: string, field: keyof EvidenceItem, value: string) => {
    setEvidenceList(evidenceList.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeEvidence = (id: string) => {
    setEvidenceList(evidenceList.filter(e => e.id !== id));
  };

  const addAngle = () => {
    setAngles([
      ...angles, 
      { id: Date.now().toString(), angle: "", format: "" }
    ]);
  };

  const updateAngle = (id: string, field: keyof ContentAngle, value: string) => {
    setAngles(angles.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAngle = (id: string) => {
    setAngles(angles.filter(a => a.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Trend Saved:", { ...formData, platforms, evidenceList, angles });
    alert("Trend saved successfully!");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Add Trend Intelligence</h1>
        <p className="text-slate-500 mt-1">Manually structure and add an emerging trend to the system.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-heading font-bold text-slate-900 border-b pb-2">Core Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Trend Name</label>
              <input type="text" placeholder="e.g. AI Coding Agents" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Niche</label>
              <input type="text" placeholder="e.g. Technology / Programming" value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Trend Stage</label>
              <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option>Emerging</option><option>Growing</option><option>Trending</option><option>Peak</option><option>Declining</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Trend Strength ({formData.strength}/100)</label>
              <input type="range" min="0" max="100" value={formData.strength} onChange={e => setFormData({...formData, strength: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Observed Period</label>
            <div className="flex items-center gap-4">
              <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" required />
              <span className="text-slate-400">to</span>
              <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn"].map(p => (
                <button key={p} type="button" onClick={() => togglePlatform(p)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${platforms.includes(p) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-gray-300 hover:bg-gray-50"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Audience</label>
            <input type="text" placeholder="e.g. Developers, Students" value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" required />
          </div>
        </div>

        {/* Observed Pattern */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-heading font-bold text-slate-900 border-b pb-2">Observed Pattern</h2>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Document the pattern observed in the market</label>
            <textarea 
              rows={4}
              placeholder="e.g. Short-form tutorials demonstrating real AI coding workflows are outperforming generic AI news content."
              value={formData.observedPattern}
              onChange={e => setFormData({...formData, observedPattern: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
              required
            />
          </div>
        </div>

        {/* Trend Evidence */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-heading font-bold text-slate-900">Trend Evidence</h2>
            <button type="button" onClick={addEvidence} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              <HiPlus /> Add Evidence
            </button>
          </div>
          <div className="space-y-4">
            {evidenceList.length === 0 && <p className="text-sm text-slate-500 italic">No evidence added yet.</p>}
            {evidenceList.map((ev) => (
              <div key={ev.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                <button type="button" onClick={() => removeEvidence(ev.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                  <HiTrash className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-8">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Creator/Source</label>
                    <input type="text" value={ev.creatorName} onChange={e => updateEvidence(ev.id, 'creatorName', e.target.value)} className="w-full px-3 py-1.5 text-sm rounded border border-gray-300" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Platform</label>
                    <select value={ev.platform} onChange={e => updateEvidence(ev.id, 'platform', e.target.value)} className="w-full px-3 py-1.5 text-sm rounded border border-gray-300">
                      <option>TikTok</option><option>Instagram</option><option>YouTube</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">URL (Optional)</label>
                    <input type="url" value={ev.url} onChange={e => updateEvidence(ev.id, 'url', e.target.value)} className="w-full px-3 py-1.5 text-sm rounded border border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Views</label>
                    <input type="text" placeholder="e.g. 2.1M" value={ev.views} onChange={e => updateEvidence(ev.id, 'views', e.target.value)} className="w-full px-3 py-1.5 text-sm rounded border border-gray-300" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Engagement</label>
                    <input type="text" placeholder="e.g. 120K likes" value={ev.engagement} onChange={e => updateEvidence(ev.id, 'engagement', e.target.value)} className="w-full px-3 py-1.5 text-sm rounded border border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">% Above Average</label>
                    <input type="text" placeholder="e.g. +180%" value={ev.percentageAboveAvg} onChange={e => updateEvidence(ev.id, 'percentageAboveAvg', e.target.value)} className="w-full px-3 py-1.5 text-sm rounded border border-gray-300" required />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Opportunities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-heading font-bold text-slate-900">Content Opportunities</h2>
            <button type="button" onClick={addAngle} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              <HiPlus /> Add Angle
            </button>
          </div>
          <div className="space-y-3">
            {angles.length === 0 && <p className="text-sm text-slate-500 italic">No content angles defined yet.</p>}
            {angles.map((angle) => (
              <div key={angle.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <input type="text" placeholder="Content Angle (e.g. Real project experiment)" value={angle.angle} onChange={e => updateAngle(angle.id, 'angle', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-indigo-500" required />
                </div>
                <div className="w-1/3">
                  <input type="text" placeholder="Recommended Format (e.g. Tutorial)" value={angle.format} onChange={e => updateAngle(angle.id, 'format', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <button type="button" onClick={() => removeAngle(angle.id)} className="p-2.5 text-slate-400 hover:text-red-500 transition-colors mt-0.5">
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 z-10 -mx-6 px-6 pb-8">
          <button type="button" className="px-5 py-2 text-slate-600 hover:text-slate-900 font-medium">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm">
            Save Trend
          </button>
        </div>

      </form>
    </div>
  );
}
