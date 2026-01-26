'use client';

import { useMemo } from 'react';
import { Review } from '@/types';

interface TrendChartProps {
  reviews: Review[];
  days?: number;
}

export default function TrendChart({ reviews, days = 365 }: TrendChartProps) {
  const trendData = useMemo(() => {
    const now = new Date();

    // Group by week if more than 60 days, otherwise by day
    const groupByWeek = days > 60;
    const bucketCount = groupByWeek ? Math.ceil(days / 7) : days;

    const data: { date: string; label: string; count: number; avgRating: number; ratings: number[] }[] = [];

    // Create buckets
    for (let i = bucketCount - 1; i >= 0; i--) {
      const date = new Date(now);
      if (groupByWeek) {
        date.setDate(date.getDate() - i * 7);
      } else {
        date.setDate(date.getDate() - i);
      }
      const dateStr = date.toISOString().split('T')[0];
      const label = groupByWeek
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      data.push({ date: dateStr, label, count: 0, avgRating: 0, ratings: [] });
    }

    // Fill buckets with review data
    reviews.forEach((review) => {
      const reviewDate = new Date(review.date);
      const diffTime = now.getTime() - reviewDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < days) {
        let bucketIndex;
        if (groupByWeek) {
          bucketIndex = bucketCount - 1 - Math.floor(diffDays / 7);
        } else {
          bucketIndex = bucketCount - 1 - diffDays;
        }

        if (bucketIndex >= 0 && bucketIndex < data.length) {
          data[bucketIndex].count++;
          data[bucketIndex].ratings.push(review.rating);
        }
      }
    });

    // Calculate averages
    data.forEach((d) => {
      if (d.ratings.length > 0) {
        d.avgRating = d.ratings.reduce((a, b) => a + b, 0) / d.ratings.length;
      }
    });

    return data;
  }, [reviews, days]);

  const maxCount = Math.max(...trendData.map((d) => d.count), 1);
  const totalReviews = trendData.reduce((sum, d) => sum + d.count, 0);

  // Calculate period label
  const periodLabel = days === 365 ? 'Last 12 months' : days === 90 ? 'Last 3 months' : `Last ${days} days`;

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-zinc-900">Review Trend</h3>
        <span className="text-[11px] text-zinc-400">{periodLabel}</span>
      </div>

      {/* Summary */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-semibold text-zinc-900">{totalReviews}</span>
        <span className="text-[12px] text-zinc-500">reviews in period</span>
      </div>

      {/* Chart */}
      <div className="h-28 flex items-end gap-[1px]">
        {trendData.map((bucket, i) => {
          const height = (bucket.count / maxCount) * 100;
          const color = bucket.avgRating >= 4
            ? 'bg-emerald-400'
            : bucket.avgRating >= 3
            ? 'bg-amber-400'
            : bucket.avgRating > 0
            ? 'bg-red-400'
            : 'bg-zinc-200';

          return (
            <div
              key={i}
              className="flex-1 group relative"
            >
              <div
                className={`w-full rounded-sm transition-all ${color} hover:opacity-80`}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                {bucket.label}
                <br />
                {bucket.count} reviews
                {bucket.avgRating > 0 && ` • ${bucket.avgRating.toFixed(1)}★`}
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-[10px] text-zinc-400">
        <span>{trendData[0]?.label}</span>
        <span>{trendData[Math.floor(trendData.length / 2)]?.label}</span>
        <span>Now</span>
      </div>
    </div>
  );
}
