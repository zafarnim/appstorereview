'use client';

import { useState } from 'react';
import { App } from '@/types';
import StarRating from './StarRating';
import Image from 'next/image';

interface AppDetailPanelProps {
  app: App;
  onClose: () => void;
}

export default function AppDetailPanel({ app, onClose }: AppDetailPanelProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isReleaseNotesExpanded, setIsReleaseNotesExpanded] = useState(false);

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
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-5 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-100 shadow-sm">
            <Image
              src={app.icon}
              alt={app.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold text-zinc-900 mb-0.5">{app.name}</h2>
            <p className="text-[13px] text-zinc-500 mb-2">{app.developer}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <StarRating rating={app.rating} size="sm" />
                <span className="text-[13px] font-medium text-zinc-700">
                  {app.rating.toFixed(1)}
                </span>
                <span className="text-[12px] text-zinc-400">
                  ({formatReviewCount(app.reviewCount)} ratings)
                </span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Quick Info Pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 rounded-full text-[12px] font-medium text-zinc-700">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {app.formattedPrice || (app.price === 0 ? 'Free' : `$${app.price?.toFixed(2)}`)}
        </span>

        {app.version && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 rounded-full text-[12px] font-medium text-zinc-700">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            v{app.version}
          </span>
        )}

        {app.contentRating && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 rounded-full text-[12px] font-medium text-zinc-700">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            {app.contentRating}
          </span>
        )}

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 rounded-full text-[12px] font-medium text-zinc-700">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {app.category}
        </span>

        {app.fileSizeBytes && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 rounded-full text-[12px] font-medium text-zinc-700">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {formatFileSize(app.fileSizeBytes)}
          </span>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-zinc-50 rounded-xl mb-5">
        <div>
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Released</p>
          <p className="text-[13px] font-medium text-zinc-900">{formatDate(app.releaseDate)}</p>
        </div>
        <div>
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Updated</p>
          <p className="text-[13px] font-medium text-zinc-900">{formatDate(app.currentVersionReleaseDate)}</p>
        </div>
        <div>
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Min iOS</p>
          <p className="text-[13px] font-medium text-zinc-900">{app.minimumOsVersion || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Bundle ID</p>
          <p className="text-[13px] font-medium text-zinc-900 truncate" title={app.bundleId}>{app.bundleId || 'N/A'}</p>
        </div>
      </div>

      {/* Genres */}
      {app.genres && app.genres.length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Categories</p>
          <div className="flex flex-wrap gap-1.5">
            {app.genres.map((genre, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[11px] font-medium rounded-md"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {app.description && (
        <div className="mb-5">
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Description</p>
          <div className="relative">
            <p className={`text-[13px] text-zinc-600 leading-relaxed whitespace-pre-line ${
              !isDescriptionExpanded ? 'line-clamp-3' : ''
            }`}>
              {app.description}
            </p>
            {app.description.length > 200 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-[12px] text-zinc-900 font-medium hover:underline mt-1"
              >
                {isDescriptionExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Release Notes */}
      {app.releaseNotes && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider">What&apos;s New</p>
            {app.version && (
              <span className="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">v{app.version}</span>
            )}
          </div>
          <div className="relative">
            <p className={`text-[13px] text-zinc-600 leading-relaxed whitespace-pre-line ${
              !isReleaseNotesExpanded ? 'line-clamp-3' : ''
            }`}>
              {app.releaseNotes}
            </p>
            {app.releaseNotes.length > 150 && (
              <button
                onClick={() => setIsReleaseNotesExpanded(!isReleaseNotesExpanded)}
                className="text-[12px] text-zinc-900 font-medium hover:underline mt-1"
              >
                {isReleaseNotesExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
        {app.trackUrl && (
          <a
            href={app.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on App Store
          </a>
        )}
        {app.developerUrl && (
          <a
            href={app.developerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Developer
          </a>
        )}
        {app.sellerUrl && (
          <a
            href={app.sellerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Website
          </a>
        )}
      </div>
    </div>
  );
}
