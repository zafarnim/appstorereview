'use client';

import StarRating from './StarRating';

interface StatsCardsProps {
  totalReviews: number;
  averageRating: number;
  positiveCount: number;
  negativeCount: number;
}

export default function StatsCards({ totalReviews, averageRating, positiveCount, negativeCount }: StatsCardsProps) {
  const positivePercentage = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;
  const negativePercentage = totalReviews > 0 ? Math.round((negativeCount / totalReviews) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Total Reviews */}
      <div className="bg-white rounded-xl border border-zinc-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Reviews</p>
            <p className="text-xl font-semibold text-zinc-900 -mt-0.5">{totalReviews.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="bg-white rounded-xl border border-zinc-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Avg Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold text-zinc-900 -mt-0.5">{averageRating.toFixed(1)}</p>
              <StarRating rating={averageRating} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Positive */}
      <div className="bg-white rounded-xl border border-zinc-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Positive</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-semibold text-zinc-900 -mt-0.5">{positiveCount.toLocaleString()}</p>
              <span className="text-[11px] text-emerald-600 font-medium">{positivePercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Negative */}
      <div className="bg-white rounded-xl border border-zinc-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Negative</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-semibold text-zinc-900 -mt-0.5">{negativeCount.toLocaleString()}</p>
              <span className="text-[11px] text-red-600 font-medium">{negativePercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
