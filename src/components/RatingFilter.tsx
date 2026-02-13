'use client';

import { trackEvent } from '@/components/Analytics';

interface RatingFilterProps {
  value: number | null;
  onChange: (rating: number | null) => void;
}

export default function RatingFilter({ value, onChange }: RatingFilterProps) {
  const ratings = [
    { value: null, label: 'All', stars: null },
    { value: 5, label: '5', stars: 5 },
    { value: 4, label: '4', stars: 4 },
    { value: 3, label: '3', stars: 3 },
    { value: 2, label: '2', stars: 2 },
    { value: 1, label: '1', stars: 1 },
  ];

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[13px] text-zinc-500 mr-2">Filter:</span>
      {ratings.map((rating) => (
        <button
          key={rating.value ?? 'all'}
          onClick={() => {
            trackEvent('rating_filtered', { rating: rating.value ?? 'all' });
            onChange(rating.value);
          }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-md transition-all ${
            value === rating.value
              ? 'bg-zinc-900 text-white'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
          }`}
        >
          {rating.stars && (
            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
          {rating.label}
        </button>
      ))}
    </div>
  );
}
