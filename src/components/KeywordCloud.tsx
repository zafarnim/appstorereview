'use client';

import { useMemo, useState } from 'react';
import { Review, KeywordData } from '@/types';
import { getTopKeywords, getPainPoints, filterReviewsByKeyword } from '@/lib/textAnalysis';

interface KeywordCloudProps {
  reviews: Review[];
  onFilterByKeyword?: (keyword: string | null) => void;
}

type ViewMode = 'all' | 'painpoints';

export default function KeywordCloud({ reviews, onFilterByKeyword }: KeywordCloudProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [hoveredKeyword, setHoveredKeyword] = useState<KeywordData | null>(null);

  const keywords = useMemo(() => {
    if (viewMode === 'painpoints') {
      return getPainPoints(reviews, 30);
    }
    return getTopKeywords(reviews, 40);
  }, [reviews, viewMode]);

  const maxCount = useMemo(() => {
    return Math.max(...keywords.map(k => k.count), 1);
  }, [keywords]);

  const getSize = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'text-[16px] font-semibold';
    if (ratio > 0.5) return 'text-[14px] font-medium';
    if (ratio > 0.3) return 'text-[13px] font-medium';
    return 'text-[12px]';
  };

  const getColor = (sentiment: KeywordData['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100';
      case 'negative':
        return 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100';
      default:
        return 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100';
    }
  };

  const handleKeywordClick = (keyword: string) => {
    if (selectedKeyword === keyword) {
      setSelectedKeyword(null);
      onFilterByKeyword?.(null);
    } else {
      setSelectedKeyword(keyword);
      onFilterByKeyword?.(keyword);
    }
  };

  const matchingReviewCount = useMemo(() => {
    if (!selectedKeyword) return 0;
    return filterReviewsByKeyword(reviews, selectedKeyword).length;
  }, [reviews, selectedKeyword]);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-medium text-zinc-900">Keyword Analysis</h3>
        <div className="flex items-center gap-1 p-0.5 bg-zinc-100 rounded-lg">
          <button
            onClick={() => {
              setViewMode('all');
              setSelectedKeyword(null);
              onFilterByKeyword?.(null);
            }}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              viewMode === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
            }`}
          >
            All Topics
          </button>
          <button
            onClick={() => {
              setViewMode('painpoints');
              setSelectedKeyword(null);
              onFilterByKeyword?.(null);
            }}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              viewMode === 'painpoints' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
            }`}
          >
            Pain Points
          </button>
        </div>
      </div>

      {/* Selected Keyword Info */}
      {selectedKeyword && (
        <div className="flex items-center justify-between mb-3 px-3 py-2 bg-zinc-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-zinc-600">
              Filtering by: <strong>{selectedKeyword}</strong>
            </span>
            <span className="text-[11px] text-zinc-400">
              ({matchingReviewCount} reviews)
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedKeyword(null);
              onFilterByKeyword?.(null);
            }}
            className="text-[11px] text-zinc-500 hover:text-zinc-700"
          >
            Clear
          </button>
        </div>
      )}

      {/* Keyword Cloud */}
      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((keyword) => (
            <button
              key={keyword.word}
              onClick={() => handleKeywordClick(keyword.word)}
              onMouseEnter={() => setHoveredKeyword(keyword)}
              onMouseLeave={() => setHoveredKeyword(null)}
              className={`px-2 py-1 rounded-md border transition-all cursor-pointer ${getSize(keyword.count)} ${getColor(keyword.sentiment)} ${
                selectedKeyword === keyword.word ? 'ring-2 ring-zinc-400 ring-offset-1' : ''
              }`}
            >
              {keyword.word}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-[13px] text-zinc-500">
            {viewMode === 'painpoints'
              ? 'No pain points identified'
              : 'Not enough data for keyword analysis'}
          </p>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredKeyword && (
        <div className="mt-3 pt-3 border-t border-zinc-100">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-zinc-600">
              <strong>{hoveredKeyword.word}</strong>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-zinc-500">
                {hoveredKeyword.count} mentions
              </span>
              <span className="text-[11px] text-zinc-500">
                Avg rating: {hoveredKeyword.avgRating}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                hoveredKeyword.sentiment === 'positive'
                  ? 'bg-emerald-100 text-emerald-700'
                  : hoveredKeyword.sentiment === 'negative'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {hoveredKeyword.sentiment}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-zinc-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Positive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Neutral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-500">Negative</span>
        </div>
      </div>
    </div>
  );
}
