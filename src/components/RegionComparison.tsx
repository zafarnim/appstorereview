'use client';

import { useState, useEffect } from 'react';
import { App, COUNTRIES, RegionStats } from '@/types';
import StarRating from './StarRating';

interface RegionComparisonProps {
  appId: string;
  appName: string;
}

export default function RegionComparison({ appId, appName }: RegionComparisonProps) {
  const [regions, setRegions] = useState<RegionStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch app data for all regions in parallel
        const promises = COUNTRIES.map(async (country) => {
          try {
            const response = await fetch(`/api/lookup?appId=${appId}&country=${country.code}`);
            if (!response.ok) return null;
            const data = await response.json();
            if (!data.app) return null;

            return {
              country: country.code,
              countryName: country.name,
              flag: country.flag,
              rating: data.app.rating || 0,
              reviewCount: data.app.reviewCount || 0,
            } as RegionStats;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((r): r is RegionStats => r !== null && r.rating > 0);

        // Sort by rating descending
        validResults.sort((a, b) => b.rating - a.rating);
        setRegions(validResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load regional data');
      } finally {
        setIsLoading(false);
      }
    };

    if (appId) {
      fetchRegions();
    }
  }, [appId]);

  const maxReviewCount = Math.max(...regions.map(r => r.reviewCount), 1);

  const formatReviewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-emerald-500';
    if (rating >= 4.0) return 'bg-emerald-400';
    if (rating >= 3.5) return 'bg-amber-400';
    if (rating >= 3.0) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-zinc-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[18px]">🌍</span>
          <h3 className="text-[13px] font-medium text-zinc-900">Regional Performance</h3>
        </div>
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-[13px] text-zinc-500">Loading regional data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-zinc-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[18px]">🌍</span>
          <h3 className="text-[13px] font-medium text-zinc-900">Regional Performance</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-[13px] text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (regions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[18px]">🌍</span>
          <h3 className="text-[13px] font-medium text-zinc-900">Regional Performance</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-[13px] text-zinc-500">No regional data available</p>
        </div>
      </div>
    );
  }

  // Calculate average rating across all regions
  const avgRating = regions.reduce((sum, r) => sum + r.rating, 0) / regions.length;
  const totalReviews = regions.reduce((sum, r) => sum + r.reviewCount, 0);

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[18px]">🌍</span>
          <h3 className="text-[13px] font-medium text-zinc-900">Regional Performance</h3>
        </div>
        <span className="text-[11px] text-zinc-400">{regions.length} regions</span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-zinc-50 rounded-lg">
        <div>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-0.5">Global Average</p>
          <div className="flex items-center gap-1.5">
            <StarRating rating={avgRating} size="sm" />
            <span className="text-[14px] font-semibold text-zinc-900">{avgRating.toFixed(1)}</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-0.5">Total Reviews</p>
          <p className="text-[14px] font-semibold text-zinc-900">{formatReviewCount(totalReviews)}</p>
        </div>
      </div>

      {/* Region List */}
      <div className="space-y-2">
        {regions.map((region) => {
          const barWidth = (region.reviewCount / maxReviewCount) * 100;

          return (
            <div
              key={region.country}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              {/* Country */}
              <div className="flex items-center gap-2 w-32 flex-shrink-0">
                <span className="text-[16px]">{region.flag}</span>
                <span className="text-[12px] font-medium text-zinc-700 truncate">
                  {region.countryName}
                </span>
              </div>

              {/* Rating Bar */}
              <div className="flex-1 h-6 bg-zinc-100 rounded-md overflow-hidden relative">
                <div
                  className={`h-full ${getRatingColor(region.rating)} transition-all duration-500`}
                  style={{ width: `${barWidth}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <span className="text-[11px] font-medium text-zinc-700 drop-shadow-sm">
                    {region.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {formatReviewCount(region.reviewCount)} reviews
                  </span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="w-20 flex-shrink-0">
                <StarRating rating={region.rating} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rating Variance */}
      {regions.length > 1 && (
        <div className="mt-4 pt-3 border-t border-zinc-100">
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>Rating range: {Math.min(...regions.map(r => r.rating)).toFixed(1)} - {Math.max(...regions.map(r => r.rating)).toFixed(1)}</span>
            <span>
              Best: {regions[0]?.flag} {regions[0]?.countryName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
