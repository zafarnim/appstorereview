'use client';

import { useState, useEffect } from 'react';
import { App, COUNTRIES } from '@/types';
import StarRating from './StarRating';
import Image from 'next/image';
import { trackEvent } from '@/components/Analytics';

interface AppDetailPanelProps {
  app: App;
  onClose: () => void;
}

interface CountryAvailability {
  code: string;
  name: string;
  flag: string;
  available: boolean;
  rating?: number;
  reviewCount?: number;
}

export default function AppDetailPanel({ app, onClose }: AppDetailPanelProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isReleaseNotesExpanded, setIsReleaseNotesExpanded] = useState(false);
  const [countryAvailability, setCountryAvailability] = useState<CountryAvailability[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [showIpadScreenshots, setShowIpadScreenshots] = useState(false);

  const screenshots = showIpadScreenshots && app.ipadScreenshotUrls?.length
    ? app.ipadScreenshotUrls
    : app.screenshotUrls || [];

  // Fetch country availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      setIsLoadingAvailability(true);

      const checks = COUNTRIES.map(async (country) => {
        try {
          const response = await fetch(`/api/lookup?appId=${app.id}&country=${country.code}`);
          if (response.ok) {
            const data = await response.json();
            if (data.app) {
              return {
                code: country.code,
                name: country.name,
                flag: country.flag,
                available: true,
                rating: data.app.rating,
                reviewCount: data.app.reviewCount,
              };
            }
          }
          return {
            code: country.code,
            name: country.name,
            flag: country.flag,
            available: false,
          };
        } catch {
          return {
            code: country.code,
            name: country.name,
            flag: country.flag,
            available: false,
          };
        }
      });

      const resolved = await Promise.all(checks);
      setCountryAvailability(resolved);
      setIsLoadingAvailability(false);
    };

    checkAvailability();
  }, [app.id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return 'N/A';
    const size = parseInt(bytes, 10);
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const availableCount = countryAvailability.filter(c => c.available).length;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden mb-6">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 pb-8">
        {/* Close Button */}
        <button
          onClick={() => {
            trackEvent('app_detail_closed', { appId: app.id });
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* App Info */}
        <div className="flex items-start gap-5">
          {/* App Icon */}
          <div className="relative w-24 h-24 rounded-[22px] overflow-hidden flex-shrink-0 shadow-2xl ring-2 ring-white/20">
            <Image
              src={app.icon}
              alt={app.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* App Details */}
          <div className="flex-1 min-w-0 pt-1">
            <h2 className="text-xl font-semibold text-white mb-1 truncate pr-8">{app.name}</h2>
            <p className="text-[14px] text-white/60 mb-3">{app.developer}</p>

            {/* Rating & Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-[14px] font-semibold text-white">{app.rating.toFixed(1)}</span>
                </div>
                <span className="text-[13px] text-white/50">
                  {formatReviewCount(app.reviewCount)} ratings
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[12px] font-medium text-white">
            {app.formattedPrice || (app.price === 0 ? 'Free' : `$${app.price?.toFixed(2)}`)}
          </span>
          {app.version && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[12px] font-medium text-white">
              v{app.version}
            </span>
          )}
          {app.contentRating && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[12px] font-medium text-white">
              {app.contentRating}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[12px] font-medium text-white">
            {app.category}
          </span>
          {app.fileSizeBytes && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[12px] font-medium text-white">
              {formatFileSize(app.fileSizeBytes)}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Screenshots Gallery */}
        {screenshots.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-zinc-900">Screenshots</h3>
              {app.ipadScreenshotUrls && app.ipadScreenshotUrls.length > 0 && (
                <div className="flex items-center gap-1 p-0.5 bg-zinc-100 rounded-lg">
                  <button
                    onClick={() => { trackEvent('screenshot_device_changed', { device: 'iphone', appId: app.id }); setShowIpadScreenshots(false); setCurrentScreenshot(0); }}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                      !showIpadScreenshots ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    iPhone
                  </button>
                  <button
                    onClick={() => { trackEvent('screenshot_device_changed', { device: 'ipad', appId: app.id }); setShowIpadScreenshots(true); setCurrentScreenshot(0); }}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                      showIpadScreenshots ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    iPad
                  </button>
                </div>
              )}
            </div>

            {/* Screenshot Carousel */}
            <div className="relative">
              {/* Main Screenshot */}
              <div className="relative bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-xl overflow-hidden mb-3">
                <div className="flex justify-center p-4">
                  <div
                    className={`relative rounded-xl overflow-hidden shadow-2xl ${
                      showIpadScreenshots ? 'w-[400px] h-[300px]' : 'w-[200px] h-[400px]'
                    }`}
                  >
                    <Image
                      src={screenshots[currentScreenshot]}
                      alt={`${app.name} screenshot ${currentScreenshot + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Navigation Arrows */}
                {screenshots.length > 1 && (
                  <>
                    <button
                      onClick={() => {
                        trackEvent('screenshot_navigated', { direction: 'previous', appId: app.id });
                        setCurrentScreenshot(prev => prev > 0 ? prev - 1 : screenshots.length - 1);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        trackEvent('screenshot_navigated', { direction: 'next', appId: app.id });
                        setCurrentScreenshot(prev => prev < screenshots.length - 1 ? prev + 1 : 0);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {screenshots.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentScreenshot(index)}
                    className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                      index === currentScreenshot
                        ? 'ring-2 ring-zinc-900 ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      width: showIpadScreenshots ? '80px' : '50px',
                      height: showIpadScreenshots ? '60px' : '90px',
                    }}
                  >
                    <Image
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-zinc-50 rounded-xl p-4">
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Released</p>
            <p className="text-[13px] font-semibold text-zinc-900">{formatDate(app.releaseDate)}</p>
          </div>
          <div className="bg-zinc-50 rounded-xl p-4">
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Updated</p>
            <p className="text-[13px] font-semibold text-zinc-900">{formatDate(app.currentVersionReleaseDate)}</p>
          </div>
          <div className="bg-zinc-50 rounded-xl p-4">
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Min iOS</p>
            <p className="text-[13px] font-semibold text-zinc-900">{app.minimumOsVersion || 'N/A'}</p>
          </div>
          <div className="bg-zinc-50 rounded-xl p-4">
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Bundle ID</p>
            <p className="text-[13px] font-semibold text-zinc-900 truncate" title={app.bundleId}>{app.bundleId || 'N/A'}</p>
          </div>
        </div>

        {/* Country Availability */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-zinc-900">Available Regions</h3>
            {!isLoadingAvailability && (
              <span className="text-[12px] text-zinc-500">
                {availableCount} of {countryAvailability.length} regions
              </span>
            )}
          </div>

          {isLoadingAvailability ? (
            <div className="flex items-center gap-3 py-6">
              <svg className="animate-spin h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-[13px] text-zinc-500">Checking availability across regions...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {countryAvailability.map((country) => (
                <div
                  key={country.code}
                  className={`relative group flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-default ${
                    country.available
                      ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                      : 'bg-zinc-50 border-zinc-100 opacity-40'
                  }`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-[11px] font-semibold text-zinc-700">{country.code.toUpperCase()}</span>
                  {country.available && country.rating ? (
                    <div className="flex items-center gap-0.5">
                      <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-[10px] font-medium text-zinc-600">{country.rating.toFixed(1)}</span>
                    </div>
                  ) : country.available ? (
                    <span className="text-[10px] text-emerald-600 font-medium">Available</span>
                  ) : (
                    <span className="text-[10px] text-zinc-400">N/A</span>
                  )}

                  {/* Tooltip */}
                  {country.available && country.reviewCount !== undefined && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {formatReviewCount(country.reviewCount)} reviews
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Genres */}
        {app.genres && app.genres.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[14px] font-semibold text-zinc-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {app.genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[12px] font-medium rounded-lg transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {app.description && (
          <div className="mb-8">
            <h3 className="text-[14px] font-semibold text-zinc-900 mb-3">Description</h3>
            <div className="relative">
              <p className={`text-[13px] text-zinc-600 leading-relaxed whitespace-pre-line ${
                !isDescriptionExpanded ? 'line-clamp-4' : ''
              }`}>
                {app.description}
              </p>
              {app.description.length > 300 && (
                <button
                  onClick={() => {
                    trackEvent('description_toggled', { appId: app.id, expanded: !isDescriptionExpanded });
                    setIsDescriptionExpanded(!isDescriptionExpanded);
                  }}
                  className="mt-2 text-[13px] text-zinc-900 font-medium hover:underline inline-flex items-center gap-1"
                >
                  {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                  <svg
                    className={`w-4 h-4 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Release Notes */}
        {app.releaseNotes && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[14px] font-semibold text-zinc-900">What&apos;s New</h3>
              {app.version && (
                <span className="text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md font-medium">v{app.version}</span>
              )}
            </div>
            <div className="relative bg-zinc-50 rounded-xl p-4">
              <p className={`text-[13px] text-zinc-600 leading-relaxed whitespace-pre-line ${
                !isReleaseNotesExpanded ? 'line-clamp-4' : ''
              }`}>
                {app.releaseNotes}
              </p>
              {app.releaseNotes.length > 200 && (
                <button
                  onClick={() => {
                    trackEvent('release_notes_toggled', { appId: app.id, expanded: !isReleaseNotesExpanded });
                    setIsReleaseNotesExpanded(!isReleaseNotesExpanded);
                  }}
                  className="mt-2 text-[13px] text-zinc-900 font-medium hover:underline inline-flex items-center gap-1"
                >
                  {isReleaseNotesExpanded ? 'Show Less' : 'Read More'}
                  <svg
                    className={`w-4 h-4 transition-transform ${isReleaseNotesExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-zinc-100">
          {app.trackUrl && (
            <a
              href={app.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('external_link_clicked', { link: 'app_store', appId: app.id })}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              View on App Store
            </a>
          )}
          {app.developerUrl && (
            <a
              href={app.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('external_link_clicked', { link: 'developer_page', appId: app.id })}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[13px] font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              More by Developer
            </a>
          )}
          {app.sellerUrl && (
            <a
              href={app.sellerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('external_link_clicked', { link: 'website', appId: app.id })}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[13px] font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
