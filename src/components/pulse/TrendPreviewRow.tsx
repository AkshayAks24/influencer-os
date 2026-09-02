import type { ContentPreview } from "@/types/pulse";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface TrendPreviewRowProps {
  contentPreviews: ContentPreview[];
}

const platformIcon: Record<ContentPreview["platform"], React.ReactNode> = {
  instagram: <FaInstagram className="w-3.5 h-3.5" />,
  tiktok: <FaTiktok className="w-3.5 h-3.5" />,
  youtube: <FaYoutube className="w-3.5 h-3.5" />,
  twitter: <FaXTwitter className="w-3.5 h-3.5" />,
};

const typeLabel: Record<ContentPreview["type"], string> = {
  reel: "Reel",
  short: "Short",
  post: "Post",
  tweet: "Tweet",
};

export function TrendPreviewRow({ contentPreviews }: TrendPreviewRowProps) {
  if (!contentPreviews.length) return null;

  return (
    <div>
      <p className="text-xs font-bold font-heading uppercase tracking-wider text-pulse-muted mb-3">
        Trending Content
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {contentPreviews.map((preview) => {
          const isVertical = preview.type === "reel" || preview.type === "short";

          return (
            <div
              key={preview.id}
              className={`flex-shrink-0 snap-start rounded-xl overflow-hidden relative group ${
                isVertical ? "w-[120px]" : "w-[140px]"
              }`}
            >
              {/* Thumbnail */}
              <div
                className={`relative ${
                  isVertical ? "aspect-[9/16]" : "aspect-square"
                } bg-pulse-elevated`}
              >
                <img
                  src={preview.thumbnailUrl}
                  alt={`${preview.creatorName} ${preview.type}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Platform badge */}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5 text-white">
                  {platformIcon[preview.platform]}
                </div>

                {/* Type badge */}
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-bold font-heading text-white uppercase">
                  {typeLabel[preview.type]}
                </div>

                {/* Creator name */}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-semibold font-body text-white truncate">
                    {preview.creatorName}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
