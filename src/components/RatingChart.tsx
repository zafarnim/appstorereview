'use client';

interface RatingChartProps {
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  totalCount: number;
}

export default function RatingChart({ distribution, totalCount }: RatingChartProps) {
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      <h3 className="text-[13px] font-semibold text-zinc-900 mb-4">Rating Breakdown</h3>
      <div className="space-y-2.5">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating as keyof typeof distribution];
          const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
          const barWidth = (count / maxCount) * 100;

          return (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-8">
                <span className="text-[12px] font-medium text-zinc-600">{rating}</span>
                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className="w-10 text-[11px] text-zinc-500 text-right tabular-nums">
                {percentage.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
