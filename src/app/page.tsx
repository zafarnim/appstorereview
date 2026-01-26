import Link from 'next/link';
import { Header } from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <main className="max-w-3xl mx-auto px-6">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-16">
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
