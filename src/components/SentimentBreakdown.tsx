'use client';

import { useMemo } from 'react';
import { Review } from '@/types';

interface SentimentBreakdownProps {
  reviews: Review[];
}

export default function SentimentBreakdown({ reviews }: SentimentBreakdownProps) {
  const sentiment = useMemo(() => {
    const positive = reviews.filter((r) => r.rating >= 4).length;
    const neutral = reviews.filter((r) => r.rating === 3).length;
    const negative = reviews.filter((r) => r.rating <= 2).length;
    const total = reviews.length || 1;

    return {
      positive: { count: positive, percent: (positive / total) * 100 },
      neutral: { count: neutral, percent: (neutral / total) * 100 },
      negative: { count: negative, percent: (negative / total) * 100 },
    };
  }, [reviews]);

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      <h3 className="text-[13px] font-semibold text-zinc-900 mb-4">Sentiment Analysis</h3>

      {/* Stacked bar */}
      <div className="h-3 rounded-full overflow-hidden flex mb-4">
        <div
          className="bg-emerald-400 transition-all"
          style={{ width: `${sentiment.positive.percent}%` }}
        />
        <div
          className="bg-amber-400 transition-all"
          style={{ width: `${sentiment.neutral.percent}%` }}
        />
        <div
          className="bg-red-400 transition-all"
          style={{ width: `${sentiment.negative.percent}%` }}
        />
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-[12px] text-zinc-600">Positive (4-5 stars)</span>
          </div>
          <div className="text-[12px]">
            <span className="font-semibold text-zinc-900">{sentiment.positive.count}</span>
            <span className="text-zinc-400 ml-1">({sentiment.positive.percent.toFixed(0)}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[12px] text-zinc-600">Neutral (3 stars)</span>
          </div>
          <div className="text-[12px]">
            <span className="font-semibold text-zinc-900">{sentiment.neutral.count}</span>
            <span className="text-zinc-400 ml-1">({sentiment.neutral.percent.toFixed(0)}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-[12px] text-zinc-600">Negative (1-2 stars)</span>
          </div>
          <div className="text-[12px]">
            <span className="font-semibold text-zinc-900">{sentiment.negative.count}</span>
            <span className="text-zinc-400 ml-1">({sentiment.negative.percent.toFixed(0)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
