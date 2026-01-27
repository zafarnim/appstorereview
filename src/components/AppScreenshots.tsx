'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AppScreenshotsProps {
  screenshots: string[];
  ipadScreenshots?: string[];
  appName: string;
}

export default function AppScreenshots({ screenshots, ipadScreenshots, appName }: AppScreenshotsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIpad, setShowIpad] = useState(false);

  const displayScreenshots = showIpad && ipadScreenshots?.length ? ipadScreenshots : screenshots;

  if (!screenshots.length && !ipadScreenshots?.length) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : displayScreenshots.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < displayScreenshots.length - 1 ? prev + 1 : 0));
  };

  const visibleCount = 4;
  const startIndex = Math.max(0, Math.min(currentIndex, displayScreenshots.length - visibleCount));

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-medium text-zinc-900">Screenshots</h3>
        {ipadScreenshots && ipadScreenshots.length > 0 && (
          <div className="flex items-center gap-1 p-0.5 bg-zinc-100 rounded-lg">
            <button
              onClick={() => { setShowIpad(false); setCurrentIndex(0); }}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                !showIpad ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
              }`}
            >
              iPhone
            </button>
            <button
              onClick={() => { setShowIpad(true); setCurrentIndex(0); }}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                showIpad ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
              }`}
            >
              iPad
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Navigation Arrows */}
        {displayScreenshots.length > visibleCount && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-sm flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
              aria-label="Previous screenshot"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-sm flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
              aria-label="Next screenshot"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Screenshots Grid */}
        <div className="overflow-hidden">
          <div
            className="flex gap-2 transition-transform duration-300"
            style={{
              transform: `translateX(-${startIndex * (showIpad ? 200 : 120)}px)`,
            }}
          >
            {displayScreenshots.map((url, index) => (
              <div
                key={index}
                className={`flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100 cursor-pointer hover:ring-2 hover:ring-zinc-300 transition-all ${
                  index === currentIndex ? 'ring-2 ring-zinc-400' : ''
                }`}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: showIpad ? '180px' : '100px',
                  height: showIpad ? '140px' : '180px',
                }}
              >
                <Image
                  src={url}
                  alt={`${appName} screenshot ${index + 1}`}
                  width={showIpad ? 180 : 100}
                  height={showIpad ? 140 : 180}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {displayScreenshots.length > 1 && (
          <div className="flex justify-center gap-1 mt-3">
            {displayScreenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-zinc-700' : 'bg-zinc-300'
                }`}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Screenshot Counter */}
      <div className="text-center mt-2">
        <span className="text-[11px] text-zinc-400">
          {currentIndex + 1} / {displayScreenshots.length}
        </span>
      </div>
    </div>
  );
}
