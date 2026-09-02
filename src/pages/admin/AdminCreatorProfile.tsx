import { useParams, Link } from "react-router-dom";
import adminData from "@/data/admin.json";

export function AdminCreatorProfile() {
  const { id } = useParams();
  const profile = (adminData.creatorProfiles as any)[id || "1"]; // Fallback to 1 for mock

  if (!profile) {
    return <div className="p-8 text-slate-500">Profile not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/influencers" className="text-slate-400 hover:text-slate-900">
          &larr; Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">{profile.name}</h1>
          <p className="text-slate-500">Creator Profile Reference</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Provided Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="font-heading font-bold text-lg text-slate-900 border-b pb-2 mb-4">User Provided</h2>
          
          <DetailRow label="Niche" value={profile.niche} />
          <DetailRow label="Audience" value={profile.audience} />
          <DetailRow label="Location" value={profile.location} />
          <DetailRow label="Language" value={profile.language} />
          <DetailRow label="Primary Goal" value={profile.goal} />
          <DetailRow label="Content Preferences" value={profile.contentPreferences.join(", ")} />
        </div>

        {/* Platform Data & AI Insights */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
              Connected Platforms
            </h2>
            <DetailRow label="Accounts" value={profile.connectedAccounts.join(", ")} />
            <DetailRow label="Historical Perf." value={profile.historicalPerformance} />
            <DetailRow label="Top Content" value={profile.topContent} />
          </div>

          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-indigo-900 border-b border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded font-bold">AI</span>
              Creator DNA
            </h2>
            <DetailRow label="Best Content" value={profile.creatorDNA.bestContent} color="text-indigo-900" />
            <DetailRow label="Style" value={profile.creatorDNA.style} color="text-indigo-900" />
            <DetailRow label="Avoid" value={profile.creatorDNA.avoid} color="text-indigo-900" />
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 mt-8 pt-4">
        <Link 
          to="/admin/research"
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Research Trends for {profile.name}
        </Link>
      </div>
    </div>
  );
}

function DetailRow({ label, value, color = "text-slate-900" }: { label: string, value: string, color?: string }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">{label}</span>
      <span className={`text-sm ${color}`}>{value}</span>
    </div>
  );
}
