'use client';

import { useMemo } from 'react';
import { Review } from '@/types';

interface TrendChartProps {
  reviews: Review[];
  days?: number;
}

export default function TrendChart({ reviews, days = 30 }: TrendChartProps) {
  const trendData = useMemo(() => {
    const now = new Date();
    const data: { date: string; count: number; avgRating: number; ratings: number[] }[] = [];

    // Create buckets for each day
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      data.push({ date: dateStr, count: 0, avgRating: 0, ratings: [] });
    }

    // Fill buckets with review data
    reviews.forEach((review) => {
      const reviewDate = new Date(review.date).toISOString().split('T')[0];
      const bucket = data.find((d) => d.date === reviewDate);
      if (bucket) {
        bucket.count++;
        bucket.ratings.push(review.rating);
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

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-zinc-900">Review Trend</h3>
        <span className="text-[11px] text-zinc-400">Last {days} days</span>
      </div>

      {/* Chart */}
      <div className="h-32 flex items-end gap-[2px]">
        {trendData.map((day, i) => {
          const height = (day.count / maxCount) * 100;
          const color = day.avgRating >= 4
            ? 'bg-emerald-400'
            : day.avgRating >= 3
            ? 'bg-amber-400'
            : day.avgRating > 0
            ? 'bg-red-400'
            : 'bg-zinc-200';

          return (
            <div
              key={day.date}
              className="flex-1 group relative"
              title={`${day.date}: ${day.count} reviews`}
            >
              <div
                className={`w-full rounded-t transition-all ${color} hover:opacity-80`}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                <br />
                {day.count} reviews
                {day.avgRating > 0 && ` • ${day.avgRating.toFixed(1)}★`}
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-[10px] text-zinc-400">
        <span>{new Date(trendData[0]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span>Today</span>
      </div>
    </div>
  );
}
