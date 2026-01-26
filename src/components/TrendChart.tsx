'use client';

import { useMemo } from 'react';
import { Review } from '@/types';

interface TrendChartProps {
  reviews: Review[];
}

export default function TrendChart({ reviews }: TrendChartProps) {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const data: {
      month: string;
      label: string;
      count: number;
      avgRating: number;
      ratings: number[];
    }[] = [];

    // Create 12 monthly buckets
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      data.push({ month: monthKey, label, count: 0, avgRating: 0, ratings: [] });
    }

    // Fill buckets with review data
    reviews.forEach((review) => {
      const reviewDate = new Date(review.date);
      const monthKey = `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, '0')}`;
      const bucket = data.find((d) => d.month === monthKey);
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
  }, [reviews]);

  // Calculate trend (compare first half vs second half average)
  const firstHalf = monthlyData.slice(0, 6).filter(d => d.count > 0);
  const secondHalf = monthlyData.slice(6).filter(d => d.count > 0);

  const firstAvg = firstHalf.length > 0
    ? firstHalf.reduce((sum, d) => sum + d.avgRating, 0) / firstHalf.length
    : 0;
  const secondAvg = secondHalf.length > 0
    ? secondHalf.reduce((sum, d) => sum + d.avgRating, 0) / secondHalf.length
    : 0;

  const trend = secondAvg - firstAvg;
  const trendPercent = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

  // Current average (last month with data)
  const currentMonth = [...monthlyData].reverse().find(d => d.count > 0);
  const currentAvg = currentMonth?.avgRating || 0;

  // For the line chart, we need to scale ratings (1-5) to percentage
  const minRating = 1;
  const maxRating = 5;
  const getYPosition = (rating: number) => {
    if (rating === 0) return 100;
    return 100 - ((rating - minRating) / (maxRating - minRating)) * 100;
  };

  // Generate SVG path for the line
  const validPoints = monthlyData
    .map((d, i) => ({ x: (i / 11) * 100, y: getYPosition(d.avgRating), hasData: d.count > 0, rating: d.avgRating }))
    .filter(p => p.hasData);

  const linePath = validPoints.length > 1
    ? `M ${validPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-semibold text-zinc-900">Rating Trend</h3>
        <span className="text-[11px] text-zinc-400">Last 12 months</span>
      </div>

      {/* Current Rating & Trend */}
      <div className="flex items-end gap-3 mb-4">
        <div>
          <span className="text-3xl font-semibold text-zinc-900">{currentAvg.toFixed(1)}</span>
          <span className="text-[13px] text-zinc-400 ml-1">/ 5</span>
        </div>
        {trend !== 0 && firstAvg > 0 && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
            trend > 0
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-600'
          }`}>
            <svg
              className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {Math.abs(trendPercent).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Line Chart */}
      <div className="relative h-32 mb-2">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between text-[9px] text-zinc-400">
          <span>5.0</span>
          <span>3.0</span>
          <span>1.0</span>
        </div>

        {/* Chart area */}
        <div className="ml-7 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-zinc-100 w-full" />
            ))}
          </div>

          {/* SVG Line Chart */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#18181b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {/* Data points */}
            {monthlyData.map((d, i) => {
              if (d.count === 0) return null;
              const x = (i / 11) * 100;
              const y = getYPosition(d.avgRating);
              const color = d.avgRating >= 4 ? '#22c55e' : d.avgRating >= 3 ? '#f59e0b' : '#ef4444';

              return (
                <g key={i} className="group">
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill={color}
                    className="transition-all group-hover:r-6"
                  />
                  {/* Tooltip */}
                  <foreignObject
                    x={`${x}%`}
                    y={`${y}%`}
                    width="1"
                    height="1"
                    className="overflow-visible"
                  >
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                      {d.label}: {d.avgRating.toFixed(2)}★
                      <br />
                      {d.count} reviews
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-7 flex justify-between text-[9px] text-zinc-400">
        {monthlyData.filter((_, i) => i % 3 === 0 || i === 11).map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
