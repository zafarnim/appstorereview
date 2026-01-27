'use client';

import { useMemo } from 'react';
import { Review } from '@/types';

interface ResponseRateCardProps {
  reviews: Review[];
  onFilterByResponse?: (hasResponse: boolean | null) => void;
  currentFilter?: boolean | null;
}

export default function ResponseRateCard({ reviews, onFilterByResponse, currentFilter }: ResponseRateCardProps) {
  const stats = useMemo(() => {
    const total = reviews.length;
    const withResponse = reviews.filter(r => r.developerResponse).length;
    const withoutResponse = total - withResponse;

    // Response rate by rating
    const ratingGroups: Record<string, { total: number; responded: number }> = {
      positive: { total: 0, responded: 0 },
      neutral: { total: 0, responded: 0 },
      negative: { total: 0, responded: 0 },
    };

    reviews.forEach(review => {
      const group = review.rating >= 4 ? 'positive' : review.rating >= 3 ? 'neutral' : 'negative';
      ratingGroups[group].total++;
      if (review.developerResponse) {
        ratingGroups[group].responded++;
      }
    });

    return {
      total,
      withResponse,
      withoutResponse,
      responseRate: total > 0 ? Math.round((withResponse / total) * 100) : 0,
      ratingGroups,
    };
  }, [reviews]);

  const getRateColor = (rate: number) => {
    if (rate >= 50) return 'text-emerald-600';
    if (rate >= 25) return 'text-amber-600';
    return 'text-red-600';
  };

  const getGroupRate = (group: { total: number; responded: number }) => {
    return group.total > 0 ? Math.round((group.responded / group.total) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        <h3 className="text-[13px] font-medium text-zinc-900">Developer Response Rate</h3>
      </div>

      {/* Main Stat */}
      <div className="text-center p-4 bg-zinc-50 rounded-lg mb-4">
        <div className={`text-[32px] font-bold ${getRateColor(stats.responseRate)}`}>
          {stats.responseRate}%
        </div>
        <p className="text-[12px] text-zinc-500">
          {stats.withResponse} of {stats.total} reviews have responses
        </p>
      </div>

      {/* Response Rate by Sentiment */}
      <div className="space-y-2 mb-4">
        <p className="text-[11px] text-zinc-400 uppercase tracking-wider">By Review Type</p>

        <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[12px] text-emerald-700">Positive (4-5★)</span>
          </div>
          <div className="text-right">
            <span className="text-[12px] font-semibold text-emerald-700">
              {getGroupRate(stats.ratingGroups.positive)}%
            </span>
            <span className="text-[10px] text-emerald-600 ml-1">
              ({stats.ratingGroups.positive.responded}/{stats.ratingGroups.positive.total})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[12px] text-amber-700">Neutral (3★)</span>
          </div>
          <div className="text-right">
            <span className="text-[12px] font-semibold text-amber-700">
              {getGroupRate(stats.ratingGroups.neutral)}%
            </span>
            <span className="text-[10px] text-amber-600 ml-1">
              ({stats.ratingGroups.neutral.responded}/{stats.ratingGroups.neutral.total})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[12px] text-red-700">Negative (1-2★)</span>
          </div>
          <div className="text-right">
            <span className="text-[12px] font-semibold text-red-700">
              {getGroupRate(stats.ratingGroups.negative)}%
            </span>
            <span className="text-[10px] text-red-600 ml-1">
              ({stats.ratingGroups.negative.responded}/{stats.ratingGroups.negative.total})
            </span>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      {onFilterByResponse && (
        <div className="pt-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Filter Reviews</p>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterByResponse(currentFilter === null ? null : null)}
              className={`flex-1 px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                currentFilter === null
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterByResponse(currentFilter === true ? null : true)}
              className={`flex-1 px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                currentFilter === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              With Response
            </button>
            <button
              onClick={() => onFilterByResponse(currentFilter === false ? null : false)}
              className={`flex-1 px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                currentFilter === false
                  ? 'bg-zinc-700 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              No Response
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
