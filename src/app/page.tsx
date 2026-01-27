'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, PopularApps } from '@/components';
import { App } from '@/types';

export default function Home() {
  const router = useRouter();

  const handleSelectApp = (app: App) => {
    // Navigate to dashboard with app pre-selected
    router.push(`/dashboard?app=${app.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <main className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full text-[12px] font-medium text-zinc-600 mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Live App Store Data
          </div>

          <h1 className="text-4xl font-semibold text-zinc-900 mb-4 tracking-tight leading-tight">
            Analyze App Store
            <br />
            <span className="text-zinc-400">Reviews Instantly</span>
          </h1>

          <p className="text-[16px] text-zinc-500 mb-8 max-w-md mx-auto leading-relaxed">
            Search any iOS app and get real-time insights on user reviews,
            ratings, and sentiment across different regions.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[14px] font-medium rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Start Analyzing
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-12">
          <div className="bg-white rounded-xl border border-zinc-100 p-5">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-[14px] font-semibold text-zinc-900 mb-1">Search Apps</h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              Find any app from the App Store and access its reviews instantly.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-zinc-100 p-5">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-[14px] font-semibold text-zinc-900 mb-1">Rating Analytics</h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              View rating distributions and sentiment breakdowns at a glance.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-zinc-100 p-5">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-[14px] font-semibold text-zinc-900 mb-1">Multi-Region</h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              Compare reviews across different countries and regions.
            </p>
          </div>
        </div>

        {/* New Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pb-12">
          <div className="flex items-center gap-3 bg-white rounded-lg border border-zinc-100 p-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-zinc-900">Screenshots</p>
              <p className="text-[11px] text-zinc-500">App gallery view</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-lg border border-zinc-100 p-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-zinc-900">Keywords</p>
              <p className="text-[11px] text-zinc-500">Topic analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-lg border border-zinc-100 p-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-zinc-900">Compare</p>
              <p className="text-[11px] text-zinc-500">Side-by-side</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-lg border border-zinc-100 p-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-zinc-900">Export</p>
              <p className="text-[11px] text-zinc-500">CSV & PDF</p>
            </div>
          </div>
        </div>

        {/* Popular Apps Section */}
        <div className="pb-12">
          <PopularApps onSelectApp={handleSelectApp} />
        </div>

        {/* Supported Regions */}
        <div className="pb-20 text-center">
          <p className="text-[12px] text-zinc-400 uppercase tracking-wider mb-4">Supported Regions</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['US', 'GB', 'CA', 'AU', 'SE', 'DE', 'FR', 'JP', 'IN'].map((code) => (
              <span
                key={code}
                className="px-2.5 py-1 bg-white border border-zinc-100 rounded-md text-[12px] font-medium text-zinc-500"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
