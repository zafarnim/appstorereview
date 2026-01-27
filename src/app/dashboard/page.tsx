'use client';

import { useState, useEffect, useMemo } from 'react';
import { Review, ReviewsResponse, App } from '@/types';
import {
  Header,
  SearchBar,
  CountrySelect,
  RatingFilter,
  ReviewCard,
  RatingChart,
  StatsCards,
  AppCard,
  TrendChart,
  VersionAnalytics,
  SortDropdown,
  DateFilter,
  SentimentBreakdown,
  ReviewsTable,
  AppScreenshots,
  AppDetailPanel,
  PopularApps,
  KeywordCloud,
  RegionComparison,
  CompareView,
  ExportButton,
  ResponseRateCard,
} from '@/components';
import type { SortOption, DateRange } from '@/components';
import { filterReviewsByKeyword } from '@/lib/textAnalysis';

type ViewMode = 'cards' | 'table';
type TabView = 'analytics' | 'keywords' | 'regions' | 'compare';

export default function DashboardPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState('us');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [activeTab, setActiveTab] = useState<TabView>('analytics');
  const [keywordFilter, setKeywordFilter] = useState<string | null>(null);
  const [responseFilter, setResponseFilter] = useState<boolean | null>(null);
  const [compareApps, setCompareApps] = useState<App[]>([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const searchApps = async (query: string) => {
    setIsSearching(true);
    setError(null);
    setSelectedApp(null);
    setReviews([]);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&country=${country}`
      );

      if (!response.ok) {
        throw new Error('Failed to search apps');
      }

      const data = await response.json();
      setApps(data.apps || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSearching(false);
    }
  };

  const fetchReviews = async (appId: string) => {
    setIsLoadingReviews(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/reviews?appId=${appId}&country=${country}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data: ReviewsResponse = await response.json();

      setReviews(data.reviews);
      setStats({
        totalCount: data.totalCount,
        averageRating: data.averageRating,
        ratingDistribution: data.ratingDistribution,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleAppSelect = (app: App) => {
    setSelectedApp(app);
    setKeywordFilter(null);
    setResponseFilter(null);
    fetchReviews(app.id);
  };

  const handlePopularAppSelect = (app: App) => {
    setApps([]);
    setSelectedApp(app);
    setKeywordFilter(null);
    setResponseFilter(null);
    fetchReviews(app.id);
  };

  const handleAddToCompare = (app: App) => {
    if (compareApps.length < 3 && !compareApps.find(a => a.id === app.id)) {
      setCompareApps([...compareApps, app]);
    }
  };

  const handleRemoveFromCompare = (appId: string) => {
    setCompareApps(compareApps.filter(a => a.id !== appId));
  };

  useEffect(() => {
    if (selectedApp) {
      fetchReviews(selectedApp.id);
    }
  }, [country]);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Keyword filter
    if (keywordFilter) {
      filtered = filterReviewsByKeyword(filtered, keywordFilter);
    }

    // Response filter
    if (responseFilter !== null) {
      filtered = filtered.filter(r =>
        responseFilter ? !!r.developerResponse : !r.developerResponse
      );
    }

    // Date filter
    if (dateRange !== 'all') {
      const now = new Date();
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
      const cutoff = new Date(now.setDate(now.getDate() - days));
      filtered = filtered.filter((r) => new Date(r.date) >= cutoff);
    }

    // Rating filter
    if (ratingFilter) {
      filtered = filtered.filter((r) => r.rating === ratingFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, ratingFilter, sortBy, dateRange, keywordFilter, responseFilter]);

  const positiveCount = reviews.filter((r) => r.rating >= 4).length;
  const negativeCount = reviews.filter((r) => r.rating <= 2).length;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Search Section */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-zinc-900 mb-2 tracking-tight">
            App Store Review Analytics
          </h1>
          <p className="text-[15px] text-zinc-500 mb-6">
            Search for any iOS app to analyze reviews and ratings
          </p>
          <div className="flex flex-col items-center gap-3">
            <SearchBar
              onSearch={searchApps}
              placeholder="Search apps..."
              isLoading={isSearching}
            />
            <div className="w-40">
              <CountrySelect value={country} onChange={setCountry} />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        {/* Popular Apps Section - Show when no search/selection */}
        {!isSearching && apps.length === 0 && !selectedApp && (
          <div className="mb-8">
            <PopularApps
              onSelectApp={handlePopularAppSelect}
              country={country}
            />
          </div>
        )}

        {/* App Search Results */}
        {apps.length > 0 && !selectedApp && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-medium text-zinc-500">
                {apps.length} apps found
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {apps.map((app) => (
                <div key={app.id} className="relative group">
                  <AppCard app={app} onSelect={handleAppSelect} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCompare(app);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white border border-zinc-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Add to comparison"
                  >
                    <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compare Apps View */}
        {compareApps.length > 0 && !selectedApp && (
          <div className="mb-8">
            <CompareView
              apps={compareApps}
              onRemoveApp={handleRemoveFromCompare}
              country={country}
            />
          </div>
        )}

        {/* Selected App Panel */}
        {selectedApp && (
          <AppDetailPanel
            app={selectedApp}
            onClose={() => {
              setSelectedApp(null);
              setReviews([]);
              setKeywordFilter(null);
              setResponseFilter(null);
            }}
          />
        )}

        {/* App Screenshots */}
        {selectedApp && selectedApp.screenshotUrls && selectedApp.screenshotUrls.length > 0 && (
          <div className="mb-6">
            <AppScreenshots
              screenshots={selectedApp.screenshotUrls}
              ipadScreenshots={selectedApp.ipadScreenshotUrls}
              appName={selectedApp.name}
            />
          </div>
        )}

        {/* Loading Reviews */}
        {isLoadingReviews && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-[13px] text-zinc-500">Loading reviews...</span>
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {selectedApp && reviews.length > 0 && !isLoadingReviews && (
          <>
            {/* Stats Cards */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <StatsCards
                  totalReviews={stats.totalCount}
                  averageRating={stats.averageRating}
                  positiveCount={positiveCount}
                  negativeCount={negativeCount}
                />
                <ExportButton
                  app={selectedApp}
                  stats={{ ...stats, reviews }}
                  reviews={reviews}
                  country={country}
                />
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl mb-6 w-fit">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('keywords')}
                className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                  activeTab === 'keywords'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                Keywords
              </button>
              <button
                onClick={() => setActiveTab('regions')}
                className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                  activeTab === 'regions'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                Regions
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                  activeTab === 'compare'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                Compare
              </button>
            </div>

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <>
                {/* Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <TrendChart reviews={reviews} />
                  <SentimentBreakdown reviews={reviews} />
                  <VersionAnalytics reviews={reviews} />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl border border-zinc-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <DateFilter value={dateRange} onChange={setDateRange} />
                    <div className="w-px h-5 bg-zinc-200" />
                    <RatingFilter value={ratingFilter} onChange={setRatingFilter} />
                  </div>
                  <div className="flex items-center gap-3">
                    <SortDropdown value={sortBy} onChange={setSortBy} />
                    <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode('cards')}
                        className={`p-1.5 ${viewMode === 'cards' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                        title="Card View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 ${viewMode === 'table' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                        title="Table View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Sidebar */}
                  <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-20 lg:self-start">
                    <RatingChart
                      distribution={stats.ratingDistribution}
                      totalCount={stats.totalCount}
                    />
                    <ResponseRateCard
                      reviews={reviews}
                      onFilterByResponse={setResponseFilter}
                      currentFilter={responseFilter}
                    />
                  </div>

                  {/* Reviews List/Table */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[13px] font-medium text-zinc-500">
                        {filteredReviews.length} reviews
                        {dateRange !== 'all' && ` (${dateRange})`}
                        {keywordFilter && ` matching "${keywordFilter}"`}
                        {responseFilter !== null && (responseFilter ? ' with responses' : ' without responses')}
                      </h2>
                      {(keywordFilter || responseFilter !== null) && (
                        <button
                          onClick={() => {
                            setKeywordFilter(null);
                            setResponseFilter(null);
                          }}
                          className="text-[12px] text-zinc-500 hover:text-zinc-700"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>

                    {viewMode === 'cards' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    ) : (
                      <ReviewsTable reviews={filteredReviews} />
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Keywords Tab */}
            {activeTab === 'keywords' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <KeywordCloud
                    reviews={reviews}
                    onFilterByKeyword={(keyword) => {
                      setKeywordFilter(keyword);
                      if (keyword) setActiveTab('analytics');
                    }}
                  />
                </div>
                <div>
                  <div className="bg-white rounded-xl border border-zinc-100 p-4">
                    <h3 className="text-[13px] font-medium text-zinc-900 mb-3">How to use</h3>
                    <ul className="space-y-2 text-[12px] text-zinc-600">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0" />
                        Click any keyword to filter reviews containing that word
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0" />
                        Larger words appear more frequently in reviews
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        Green keywords are associated with positive reviews
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        Red keywords indicate pain points or issues
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0" />
                        Use &quot;Pain Points&quot; view to focus on negative feedback
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Regions Tab */}
            {activeTab === 'regions' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RegionComparison
                  appId={selectedApp.id}
                  appName={selectedApp.name}
                />
                <div className="bg-white rounded-xl border border-zinc-100 p-4">
                  <h3 className="text-[13px] font-medium text-zinc-900 mb-3">About Regional Data</h3>
                  <p className="text-[12px] text-zinc-600 leading-relaxed mb-4">
                    This view shows how the app performs across different App Store regions.
                    Ratings and review counts may vary significantly between countries due to:
                  </p>
                  <ul className="space-y-2 text-[12px] text-zinc-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0" />
                      Different user expectations by market
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0" />
                      Feature availability varying by region
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0" />
                      Localization quality differences
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0" />
                      Customer support availability
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Compare Tab */}
            {activeTab === 'compare' && (
              <div>
                <CompareView
                  apps={compareApps}
                  onRemoveApp={handleRemoveFromCompare}
                  country={country}
                />
                {compareApps.length < 3 && (
                  <div className="mt-4 p-4 bg-zinc-50 rounded-xl text-center">
                    <p className="text-[13px] text-zinc-600">
                      Search for apps and click the + button to add them for comparison (up to 3 apps)
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* No Reviews State */}
        {selectedApp && !isLoadingReviews && reviews.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-[13px] text-zinc-500">No reviews found for this region</p>
          </div>
        )}
      </main>
    </div>
  );
}
