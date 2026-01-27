'use client';

import { useState } from 'react';
import { Review } from '@/types';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getIndicatorColor = (rating: number) => {
    if (rating >= 4) return 'bg-emerald-500';
    if (rating >= 3) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const hasDevResponse = !!review.developerResponse;

  return (
    <div className="group bg-white rounded-xl border border-zinc-100 p-4 hover:border-zinc-200 hover:shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${getIndicatorColor(review.rating)}`} />
          <StarRating rating={review.rating} size="sm" />
          {hasDevResponse && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Response
            </span>
          )}
        </div>
        <span className="text-[11px] text-zinc-400">{formatDate(review.date)}</span>
      </div>

      {/* Title */}
      {review.title && (
        <h3 className="text-[13px] font-semibold text-zinc-900 mb-1.5 line-clamp-1">
          {review.title}
        </h3>
      )}

      {/* Content */}
      <p className={`text-[13px] text-zinc-600 leading-relaxed mb-3 ${!isExpanded ? 'line-clamp-3' : ''}`}>
        {review.content}
      </p>

      {review.content.length > 150 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] text-zinc-500 hover:text-zinc-700 mb-3"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Developer Response */}
      {hasDevResponse && review.developerResponse && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-[11px] font-semibold text-blue-700">Developer Response</span>
            {review.developerResponse.modified && (
              <span className="text-[10px] text-blue-500 ml-auto">
                {formatDate(review.developerResponse.modified)}
              </span>
            )}
          </div>
          <p className={`text-[12px] text-blue-900 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {review.developerResponse.body}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-zinc-50">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
            <span className="text-[10px] font-medium text-zinc-500">
              {(review.userName || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-[12px] text-zinc-500 font-medium truncate max-w-[120px]">
            {review.userName || 'Anonymous'}
          </span>
        </div>
        {review.version && (
          <span className="text-[11px] text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded">
            v{review.version}
          </span>
        )}
      </div>
    </div>
  );
}
