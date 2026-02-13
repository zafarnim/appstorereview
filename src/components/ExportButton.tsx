'use client';

import { useState, useRef, useEffect } from 'react';
import { Review, App, ReviewsResponse } from '@/types';
import {
  exportToCSV,
  exportAppDataToCSV,
  exportToPDF,
  generateShareableLink,
  copyToClipboard,
} from '@/lib/export';
import { trackEvent } from '@/components/Analytics';

interface ExportButtonProps {
  app: App;
  stats: ReviewsResponse;
  reviews: Review[];
  country: string;
}

export default function ExportButton({ app, stats, reviews, country }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    trackEvent('exported', { format: 'csv', type: 'reviews', appId: app.id, count: reviews.length });
    exportToCSV(reviews, app.name);
    setIsOpen(false);
  };

  const handleExportStats = () => {
    trackEvent('exported', { format: 'csv', type: 'stats', appId: app.id });
    exportAppDataToCSV(app, stats);
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    trackEvent('exported', { format: 'pdf', type: 'report', appId: app.id });
    exportToPDF(app, stats, reviews);
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    trackEvent('link_copied', { appId: app.id });
    const link = generateShareableLink(app.id, country);
    const success = await copyToClipboard(link);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-zinc-100">
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider">Export Data</p>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full px-3 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Reviews (CSV)
            <span className="ml-auto text-[10px] text-zinc-400">{reviews.length} rows</span>
          </button>

          <button
            onClick={handleExportStats}
            className="w-full px-3 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Export App Stats (CSV)
          </button>

          <button
            onClick={handleExportPDF}
            className="w-full px-3 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Generate PDF Report
          </button>

          <div className="px-3 py-2 border-t border-zinc-100 mt-1">
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider">Share</p>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full px-3 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied ? (
              <span className="text-emerald-600">Link Copied!</span>
            ) : (
              'Copy Dashboard Link'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
