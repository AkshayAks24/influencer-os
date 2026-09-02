import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InstagramPost } from "@/types/dashboard";
import { HiOutlineHeart, HiOutlineChatBubbleOvalLeft, HiOutlineBookmark, HiOutlineShare, HiOutlineEye, HiXMark } from "react-icons/hi2";

interface PostsGridProps {
  posts: InstagramPost[];
}

function fmt(num: number): string {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toString();
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const typeCls: Record<string, string> = {
  reel: "bg-pink-100 text-pink-700",
  video: "bg-blue-100 text-blue-700",
  image: "bg-green-100 text-green-700",
  carousel: "bg-purple-100 text-purple-700",
};

export function PostsGrid({ posts }: PostsGridProps) {
  const [sel, setSel] = useState<InstagramPost | null>(null);

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">📭</span>
        <h3 className="font-heading font-bold text-lg text-pulse-text mb-2">No posts yet</h3>
        <p className="font-body text-sm text-pulse-muted max-w-sm">Once we sync your Instagram data, posts will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {posts.map((post, i) => (
          <motion.button
            key={post.id}
            className="group relative rounded-2xl overflow-hidden bg-pulse-card border border-pulse-border shadow-pulse-card hover:shadow-pulse-card-hover transition-shadow aspect-square cursor-pointer text-left"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            onClick={() => setSel(post)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={post.thumbnailUrl} alt={post.caption} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
              <div className="flex items-center gap-1"><HiOutlineHeart className="w-5 h-5" /><span className="text-sm font-heading font-bold">{fmt(post.likes)}</span></div>
              <div className="flex items-center gap-1"><HiOutlineChatBubbleOvalLeft className="w-5 h-5" /><span className="text-sm font-heading font-bold">{fmt(post.comments)}</span></div>
            </div>
            <span className={`absolute top-2 left-2 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${typeCls[post.type] || "bg-gray-100 text-gray-700"}`}>{post.type}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {sel && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSel(null)} />
            <motion.div className="relative bg-pulse-card rounded-3xl border border-pulse-border shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
              <button onClick={() => setSel(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"><HiXMark className="w-5 h-5" /></button>
              <div className="aspect-square rounded-t-3xl overflow-hidden"><img src={sel.thumbnailUrl} alt={sel.caption} className="w-full h-full object-cover" /></div>
              <div className="p-5 space-y-4">
                <p className="font-body text-sm text-pulse-text leading-relaxed">{sel.caption}</p>
                <div className="flex items-center gap-3 text-xs font-body text-pulse-muted">
                  <span className={`font-heading font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${typeCls[sel.type] || "bg-gray-100 text-gray-700"}`}>{sel.type}</span>
                  <span>{fmtDate(sel.postedAt)}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: HiOutlineHeart, label: "Likes", value: sel.likes },
                    { icon: HiOutlineChatBubbleOvalLeft, label: "Comments", value: sel.comments },
                    { icon: HiOutlineBookmark, label: "Saves", value: sel.saves },
                    { icon: HiOutlineShare, label: "Shares", value: sel.shares },
                    { icon: HiOutlineEye, label: "Reach", value: sel.reach },
                    { icon: HiOutlineEye, label: "Impressions", value: sel.impressions },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-xl bg-pulse-elevated">
                      <s.icon className="w-4 h-4 text-pulse-muted mx-auto mb-1" />
                      <p className="font-heading font-bold text-base text-pulse-text">{fmt(s.value)}</p>
                      <p className="text-[10px] font-body text-pulse-muted">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-pulse-lime/10 border border-pulse-lime/30">
                  <span className="text-sm font-heading font-semibold text-pulse-text">Engagement Rate</span>
                  <span className="text-lg font-heading font-bold text-green-600">{sel.engagementRate}%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
