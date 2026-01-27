'use client';

import { useState, useEffect } from 'react';
import { PopularApp } from '@/types';
import StarRating from './StarRating';
import Image from 'next/image';

type CategoryType = 'business' | 'productivity';

interface PopularAppsProps {
  onSelectApp: (app: PopularApp) => void;
  country?: string;
}

export default function PopularApps({ onSelectApp, country = 'us' }: PopularAppsProps) {
  const [apps, setApps] = useState<PopularApp[]>([]);
  const [category, setCategory] = useState<CategoryType>('business');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/popular?genre=${category}&country=${country}`);
        if (!response.ok) throw new Error('Failed to fetch popular apps');
        const data = await response.json();
        setApps(data.apps || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load apps');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, [category, country]);

  const formatReviewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[18px]">🔥</span>
          <h2 className="text-[15px] font-semibold text-zinc-900">Top Apps</h2>
        </div>

        {/* Category Toggle */}
        <div className="flex items-center gap-1 p-0.5 bg-zinc-100 rounded-lg">
          <button
            onClick={() => setCategory('business')}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
              category === 'business'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Business
          </button>
          <button
            onClick={() => setCategory('productivity')}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
              category === 'productivity'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Productivity
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-[13px] text-zinc-500">Loading apps...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-8">
          <p className="text-[13px] text-red-500">{error}</p>
          <button
            onClick={() => setCategory(category)}
            className="mt-2 text-[12px] text-zinc-600 hover:text-zinc-900"
          >
            Try again
          </button>
        </div>
      )}

      {/* Apps Grid */}
      {!isLoading && !error && apps.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {apps.slice(0, 10).map((app) => (
            <button
              key={app.id}
              onClick={() => onSelectApp(app)}
              className="group text-left p-3 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm transition-all"
            >
              <div className="relative mb-2">
                <div className="relative w-12 h-12 mx-auto rounded-xl overflow-hidden bg-zinc-100">
                  <Image
                    src={app.icon}
                    alt={app.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="absolute -top-1 -left-1 w-5 h-5 bg-zinc-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {app.rank}
                </span>
              </div>
              <h3 className="text-[12px] font-medium text-zinc-900 text-center truncate mb-0.5">
                {app.name}
              </h3>
              <p className="text-[10px] text-zinc-400 text-center truncate mb-1">
                {app.developer}
              </p>
              <div className="flex items-center justify-center gap-1">
                <StarRating rating={app.rating} size="sm" />
                <span className="text-[10px] text-zinc-400">
                  {app.rating > 0 ? app.rating.toFixed(1) : '-'}
                </span>
              </div>
              {app.reviewCount > 0 && (
                <p className="text-[9px] text-zinc-400 text-center mt-0.5">
                  {formatReviewCount(app.reviewCount)} reviews
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && apps.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[13px] text-zinc-500">No apps found</p>
        </div>
      )}

      {/* View All Link */}
      {!isLoading && apps.length > 10 && (
        <div className="text-center mt-4 pt-4 border-t border-zinc-100">
          <span className="text-[12px] text-zinc-400">
            Showing top 10 of {apps.length} apps
          </span>
        </div>
      )}
    </div>
  );
}
