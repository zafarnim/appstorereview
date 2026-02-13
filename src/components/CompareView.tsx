'use client';

import { useState, useEffect } from 'react';
import { App, ReviewsResponse } from '@/types';
import StarRating from './StarRating';
import Image from 'next/image';
import { trackEvent } from '@/components/Analytics';

interface AppComparison {
  app: App;
  stats: ReviewsResponse | null;
  isLoading: boolean;
}

interface CompareViewProps {
  apps: App[];
  onRemoveApp: (appId: string) => void;
  country: string;
}

export default function CompareView({ apps, onRemoveApp, country }: CompareViewProps) {
  const [comparisons, setComparisons] = useState<Map<string, AppComparison>>(new Map());

  useEffect(() => {
    const fetchStats = async (app: App) => {
      setComparisons(prev => {
        const updated = new Map(prev);
        updated.set(app.id, { app, stats: null, isLoading: true });
        return updated;
      });

      try {
        const response = await fetch(`/api/reviews?appId=${app.id}&country=${country}`);
        const stats: ReviewsResponse = response.ok ? await response.json() : null;

        setComparisons(prev => {
          const updated = new Map(prev);
          updated.set(app.id, { app, stats, isLoading: false });
          return updated;
        });
      } catch {
        setComparisons(prev => {
          const updated = new Map(prev);
          updated.set(app.id, { app, stats: null, isLoading: false });
          return updated;
        });
      }
    };

    apps.forEach(app => {
      if (!comparisons.has(app.id)) {
        fetchStats(app);
      }
    });

    // Remove apps that are no longer in the list
    setComparisons(prev => {
      const updated = new Map(prev);
      for (const key of updated.keys()) {
        if (!apps.find(a => a.id === key)) {
          updated.delete(key);
        }
      }
      return updated;
    });
  }, [apps, country]);

  const formatReviewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const getSentimentPercentage = (stats: ReviewsResponse | null, type: 'positive' | 'negative') => {
    if (!stats || stats.totalCount === 0) return 0;
    const dist = stats.ratingDistribution;
    if (type === 'positive') {
      return Math.round(((dist[4] + dist[5]) / stats.totalCount) * 100);
    }
    return Math.round(((dist[1] + dist[2]) / stats.totalCount) * 100);
  };

  if (apps.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <h3 className="text-[15px] font-semibold text-zinc-900">Compare Apps</h3>
        </div>
        <div className="text-center py-10">
          <p className="text-[13px] text-zinc-500 mb-2">Select apps to compare side by side</p>
          <p className="text-[11px] text-zinc-400">Search for apps and click the compare button</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <h3 className="text-[15px] font-semibold text-zinc-900">Compare Apps</h3>
        </div>
        <span className="text-[11px] text-zinc-400">{apps.length} apps</span>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${apps.length}, minmax(200px, 1fr))` }}>
          {apps.map(app => {
            const comparison = comparisons.get(app.id);
            const stats = comparison?.stats;
            const isLoading = comparison?.isLoading ?? true;

            return (
              <div key={app.id} className="border border-zinc-100 rounded-xl p-4">
                {/* App Header */}
                <div className="relative mb-4">
                  <button
                    onClick={() => {
                      trackEvent('app_removed_from_compare', { appId: app.id, appName: app.name });
                      onRemoveApp(app.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors"
                    aria-label="Remove from comparison"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 mb-2">
                      <Image
                        src={app.icon}
                        alt={app.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <h4 className="text-[13px] font-semibold text-zinc-900 text-center truncate w-full">
                      {app.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500 truncate w-full text-center">
                      {app.developer}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <svg className="animate-spin h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Rating */}
                    <div className="text-center p-3 bg-zinc-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="text-[20px] font-bold text-zinc-900">
                          {app.rating.toFixed(1)}
                        </span>
                        <StarRating rating={app.rating} size="sm" />
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        {formatReviewCount(app.reviewCount)} ratings
                      </p>
                    </div>

                    {/* Review Stats */}
                    {stats && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-emerald-50 rounded-lg text-center">
                            <p className="text-[16px] font-bold text-emerald-700">
                              {getSentimentPercentage(stats, 'positive')}%
                            </p>
                            <p className="text-[10px] text-emerald-600">Positive</p>
                          </div>
                          <div className="p-2 bg-red-50 rounded-lg text-center">
                            <p className="text-[16px] font-bold text-red-700">
                              {getSentimentPercentage(stats, 'negative')}%
                            </p>
                            <p className="text-[10px] text-red-600">Negative</p>
                          </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-1.5">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.ratingDistribution[star as 1|2|3|4|5];
                            const percentage = stats.totalCount > 0
                              ? (count / stats.totalCount) * 100
                              : 0;

                            return (
                              <div key={star} className="flex items-center gap-2">
                                <span className="text-[10px] text-zinc-500 w-3">{star}</span>
                                <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${star >= 4 ? 'bg-emerald-400' : star === 3 ? 'bg-amber-400' : 'bg-red-400'}`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-zinc-400 w-8 text-right">
                                  {Math.round(percentage)}%
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="text-center pt-2 border-t border-zinc-100">
                          <p className="text-[11px] text-zinc-500">
                            {stats.totalCount} recent reviews
                          </p>
                        </div>
                      </>
                    )}

                    {/* App Details */}
                    <div className="space-y-1 pt-2 border-t border-zinc-100">
                      {app.version && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-400">Version</span>
                          <span className="text-zinc-700">v{app.version}</span>
                        </div>
                      )}
                      {app.formattedPrice && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-400">Price</span>
                          <span className="text-zinc-700">{app.formattedPrice}</span>
                        </div>
                      )}
                      {app.contentRating && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-400">Age</span>
                          <span className="text-zinc-700">{app.contentRating}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-400">Category</span>
                        <span className="text-zinc-700 truncate ml-2">{app.category}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
