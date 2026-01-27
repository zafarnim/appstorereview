'use client';

import { useState, useEffect } from 'react';
import { PopularApp, COUNTRIES } from '@/types';
import StarRating from './StarRating';
import Image from 'next/image';

// Category configuration with icons
const CATEGORIES = [
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'productivity', label: 'Productivity', icon: '⚡' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'health', label: 'Health & Fitness', icon: '🏃' },
  { id: 'social', label: 'Social', icon: '💬' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '✨' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'utilities', label: 'Utilities', icon: '🔧' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'food', label: 'Food & Drink', icon: '🍔' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
] as const;

type CategoryType = typeof CATEGORIES[number]['id'];

interface PopularAppsProps {
  onSelectApp: (app: PopularApp) => void;
  country?: string;
}

export default function PopularApps({ onSelectApp, country: initialCountry }: PopularAppsProps) {
  const [apps, setApps] = useState<PopularApp[]>([]);
  const [category, setCategory] = useState<CategoryType>('business');
  const [selectedCountry, setSelectedCountry] = useState(initialCountry || 'se');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/popular?genre=${category}&country=${selectedCountry}`);
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
  }, [category, selectedCountry]);

  const formatReviewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const currentCategory = CATEGORIES.find(c => c.id === category);

  const currentCountryData = COUNTRIES.find(c => c.code === selectedCountry);

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[18px]">🔥</span>
          <h2 className="text-[15px] font-semibold text-zinc-900">Top Apps</h2>
          {currentCategory && (
            <span className="text-[12px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              {currentCategory.icon} {currentCategory.label}
            </span>
          )}
        </div>
        {/* Country Selector */}
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="appearance-none bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-8 py-1.5 text-[12px] font-medium text-zinc-700 cursor-pointer hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px]">
            {currentCountryData?.flag}
          </span>
          <svg
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Category Pills - Scrollable */}
      <div className="relative mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                category === cat.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
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

      {/* Apps Grid with Screenshots */}
      {!isLoading && !error && apps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apps.slice(0, 12).map((app) => (
            <button
              key={app.id}
              onClick={() => onSelectApp(app)}
              className="group text-left rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-md transition-all overflow-hidden"
            >
              {/* Screenshot Preview */}
              {app.screenshotUrls && app.screenshotUrls.length > 0 ? (
                <div className="relative h-32 bg-gradient-to-br from-zinc-100 to-zinc-50 overflow-hidden">
                  <div className="absolute inset-0 flex gap-1 p-2">
                    {app.screenshotUrls.slice(0, 3).map((url, idx) => (
                      <div
                        key={idx}
                        className="relative flex-1 rounded-md overflow-hidden shadow-sm"
                        style={{
                          transform: `rotate(${idx === 0 ? -2 : idx === 2 ? 2 : 0}deg)`,
                        }}
                      >
                        <Image
                          src={url}
                          alt={`${app.name} screenshot ${idx + 1}`}
                          fill
                          className="object-cover object-top"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                  {/* Rank Badge */}
                  <span className="absolute top-2 left-2 w-6 h-6 bg-zinc-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg">
                    {app.rank}
                  </span>
                </div>
              ) : (
                <div className="relative h-24 bg-gradient-to-br from-zinc-100 to-zinc-50 flex items-center justify-center">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={app.icon}
                      alt={app.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="absolute top-2 left-2 w-6 h-6 bg-zinc-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                    {app.rank}
                  </span>
                </div>
              )}

              {/* App Info */}
              <div className="p-3">
                <div className="flex items-start gap-2.5">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                    <Image
                      src={app.icon}
                      alt={app.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-semibold text-zinc-900 truncate group-hover:text-zinc-700">
                      {app.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {app.developer}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRating rating={app.rating} size="sm" />
                      <span className="text-[10px] text-zinc-500">
                        {app.rating > 0 ? app.rating.toFixed(1) : '-'}
                      </span>
                      {app.reviewCount > 0 && (
                        <span className="text-[10px] text-zinc-400">
                          ({formatReviewCount(app.reviewCount)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 mt-2">
                  {app.formattedPrice && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">
                      {app.formattedPrice === 'Free' ? 'Free' : app.formattedPrice}
                    </span>
                  )}
                  {app.contentRating && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded">
                      {app.contentRating}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && apps.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[13px] text-zinc-500">No apps found in this category</p>
        </div>
      )}

      {/* View All Link */}
      {!isLoading && apps.length > 12 && (
        <div className="text-center mt-4 pt-4 border-t border-zinc-100">
          <span className="text-[12px] text-zinc-400">
            Showing top 12 of {apps.length} apps
          </span>
        </div>
      )}
    </div>
  );
}
