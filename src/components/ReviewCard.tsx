'use client';

import { Review } from '@/types';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
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

  return (
    <div className="group bg-white rounded-xl border border-zinc-100 p-4 hover:border-zinc-200 hover:shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${getIndicatorColor(review.rating)}`} />
          <StarRating rating={review.rating} size="sm" />
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
      <p className="text-[13px] text-zinc-600 leading-relaxed line-clamp-3 mb-3">
        {review.content}
      </p>

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
