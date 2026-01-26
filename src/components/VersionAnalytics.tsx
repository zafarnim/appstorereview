'use client';

import { useMemo } from 'react';
import { Review } from '@/types';
import StarRating from './StarRating';

interface VersionAnalyticsProps {
  reviews: Review[];
}

interface VersionData {
  version: string;
  count: number;
  avgRating: number;
  ratings: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

export default function VersionAnalytics({ reviews }: VersionAnalyticsProps) {
  const versionData = useMemo(() => {
    const versions: Record<string, VersionData> = {};

    reviews.forEach((review) => {
      const version = review.version || 'Unknown';
      if (!versions[version]) {
        versions[version] = {
          version,
          count: 0,
          avgRating: 0,
          ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }
      versions[version].count++;
      const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
      if (rating >= 1 && rating <= 5) {
        versions[version].ratings[rating]++;
      }
    });

    // Calculate averages and sort by version (newest first)
    return Object.values(versions)
      .map((v) => {
        const total = Object.entries(v.ratings).reduce(
          (sum, [rating, count]) => sum + parseInt(rating) * count,
          0
        );
        v.avgRating = v.count > 0 ? total / v.count : 0;
        return v;
      })
      .sort((a, b) => {
        // Sort by version number descending
        const aParts = a.version.split('.').map(Number);
        const bParts = b.version.split('.').map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aVal = aParts[i] || 0;
          const bVal = bParts[i] || 0;
          if (bVal !== aVal) return bVal - aVal;
        }
        return 0;
      })
      .slice(0, 8); // Show top 8 versions
  }, [reviews]);

  if (versionData.length === 0) return null;

  const maxCount = Math.max(...versionData.map((v) => v.count), 1);

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      <h3 className="text-[13px] font-semibold text-zinc-900 mb-4">Rating by Version</h3>

      <div className="space-y-3">
        {versionData.map((v) => {
          const barWidth = (v.count / maxCount) * 100;
          const ratingColor =
            v.avgRating >= 4
              ? 'text-emerald-600'
              : v.avgRating >= 3
              ? 'text-amber-600'
              : 'text-red-600';

          return (
            <div key={v.version} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-zinc-700">v{v.version}</span>
                <div className="flex items-center gap-2">
                  <StarRating rating={v.avgRating} size="sm" />
                  <span className={`text-[11px] font-semibold ${ratingColor}`}>
                    {v.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-300 rounded-full transition-all group-hover:bg-zinc-400"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 w-12 text-right">
                  {v.count} reviews
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
