'use client';

import { useState } from 'react';
import { Review } from '@/types';
import StarRating from './StarRating';
import { trackEvent } from '@/components/Analytics';

interface ReviewsTableProps {
  reviews: Review[];
}

export default function ReviewsTable({ reviews }: ReviewsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-100">
            <th className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3">
              Rating
            </th>
            <th className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3">
              Review
            </th>
            <th className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
              Author
            </th>
            <th className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
              Version
            </th>
            <th className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {reviews.map((review) => (
            <tr
              key={review.id}
              className="hover:bg-zinc-50 cursor-pointer transition-colors"
              onClick={() => {
                trackEvent('review_expanded', { reviewId: review.id, expanded: expandedId !== review.id });
                setExpandedId(expandedId === review.id ? null : review.id);
              }}
            >
              <td className="px-4 py-3">
                <StarRating rating={review.rating} size="sm" />
              </td>
              <td className="px-4 py-3 max-w-md">
                <p className="text-[13px] font-medium text-zinc-900 truncate">
                  {review.title || 'No title'}
                </p>
                <p className={`text-[12px] text-zinc-500 ${expandedId === review.id ? '' : 'truncate'}`}>
                  {review.content}
                </p>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-[12px] text-zinc-600">{review.userName || 'Anonymous'}</span>
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                {review.version && (
                  <span className="text-[11px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                    v{review.version}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-[12px] text-zinc-500">{formatDate(review.date)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
