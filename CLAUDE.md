# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pikan Review is a Next.js application for analyzing iOS App Store reviews. It fetches real-time data from the iTunes API to provide insights on app ratings, sentiment, keywords, and regional performance. There is no database — all data is fetched live from Apple's APIs. No authentication or user accounts.

## Tech Stack

- **Framework:** Next.js 16.1.4 with App Router
- **React:** 19.2.3
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript 5 (strict mode)
- **Output:** Standalone (`next.config.ts` sets `output: "standalone"`)
- **Analytics:** Configurable (Umami, Plausible, GA, PostHog via env vars)

## Key Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

There is no test framework configured in this project.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── lookup/route.ts     # Single app lookup by ID
│   │   ├── popular/route.ts    # Top charts by category
│   │   ├── reviews/route.ts    # Fetch app reviews
│   │   └── search/route.ts     # Search apps by name
│   ├── dashboard/page.tsx      # Main analytics dashboard
│   ├── page.tsx                # Landing page
│   └── layout.tsx              # Root layout with SEO
├── components/
│   ├── Analytics.tsx            # Analytics provider + trackEvent() export
│   ├── Logo.tsx                # Pikan Review logo component
│   ├── AppCard.tsx             # App search result card
│   ├── AppDetailPanel.tsx      # Enhanced app details view
│   ├── AppScreenshots.tsx      # Screenshot carousel
│   ├── CompareView.tsx         # Side-by-side app comparison
│   ├── CountrySelect.tsx       # Country dropdown
│   ├── DateFilter.tsx          # Date range filter
│   ├── ExportButton.tsx        # CSV/PDF export
│   ├── Header.tsx              # Navigation header with logo
│   ├── KeywordCloud.tsx        # Word cloud visualization
│   ├── PopularApps.tsx         # Trending apps section
│   ├── RatingChart.tsx         # Rating distribution chart
│   ├── RatingFilter.tsx        # Star rating filter
│   ├── RegionComparison.tsx    # Multi-region comparison
│   ├── ReviewCard.tsx          # Individual review card
│   ├── ReviewsTable.tsx        # Table view for reviews
│   ├── SearchBar.tsx           # App search input
│   ├── SentimentBreakdown.tsx  # Positive/neutral/negative chart
│   ├── SortDropdown.tsx        # Sort options
│   ├── StarRating.tsx          # Star rating display
│   ├── StatsCards.tsx          # Summary statistics
│   ├── TrendChart.tsx          # 12-month rating trend
│   ├── VersionAnalytics.tsx    # Version-by-version analysis
│   └── index.ts                # Barrel exports (all components + types)
├── lib/
│   ├── export.ts               # CSV/PDF export utilities
│   ├── itunes.ts               # iTunes API integration
│   └── textAnalysis.ts         # Keyword extraction & sentiment
└── types/
    └── index.ts                # TypeScript interfaces + COUNTRIES constant
```

## Architecture

### Page structure

- **Landing page** (`src/app/page.tsx`) — Marketing page with feature highlights and popular apps. Clicking an app navigates to `/dashboard?app={id}`.
- **Dashboard** (`src/app/dashboard/page.tsx`) — The main application. A single large `'use client'` component (`DashboardContent`) wrapped in a `Suspense` boundary. Manages all state: search, selected app, reviews, filters, tabs (analytics/keywords/regions/compare), comparison list, sorting, and view mode (cards/table). Accepts `?app={id}` query param for deep linking.

### Data flow

All data comes from Apple's iTunes API, proxied through four Next.js API routes in `src/app/api/`. Each route is a thin wrapper calling functions from `src/lib/itunes.ts`:

- `/api/search?q={query}&country={code}` — Search apps by name (limit 10 results)
- `/api/reviews?appId={id}&country={code}` — Fetch reviews (10 pages fetched in parallel = up to 500 reviews)
- `/api/lookup?appId={id}&country={code}` — Single app details by ID
- `/api/popular?genre={category}&country={code}` — Top charts by category (RSS feed enriched with batch lookup for ratings)

**iTunes API URLs used:**
- Search: `https://itunes.apple.com/search`
- Lookup: `https://itunes.apple.com/lookup`
- RSS Reviews: `https://itunes.apple.com/rss/customerreviews`
- RSS Top Charts: `https://itunes.apple.com/rss/topfreeapplications`

**Caching:** API responses use Next.js `revalidate` — 5 minutes (`300s`) for reviews and lookup, 10 minutes (`600s`) for popular apps.

### Client-side processing

All review analysis happens in the browser, not on the server:

- **`src/lib/textAnalysis.ts`** — Keyword extraction with stop-word filtering, bigram detection (matches against a curated `COMMON_PHRASES` list), and sentiment scoring (positive/neutral/negative based on average review rating per keyword). Key exports: `extractKeywords()`, `getTopKeywords()`, `getPainPoints()`, `getFeatureRequests()`, `filterReviewsByKeyword()`.
- **`src/lib/export.ts`** — CSV export (reviews and app stats) and HTML report generation that opens in a new tab for print-to-PDF. Also provides `generateShareableLink()` and `copyToClipboard()`.

### Component patterns

- All components use **default exports** and are re-exported via `src/components/index.ts` barrel file. Import from `@/components` rather than individual files.
- Types `SortOption` and `DateRange` are also exported from the barrel (from `SortDropdown` and `DateFilter` respectively).
- **`Analytics.tsx`** is dual-purpose: it renders analytics `<Script>` tags AND exports a `trackEvent()` function. Import `trackEvent` from `@/components/Analytics` (not from the barrel).
- The `Logo` component is both in the barrel and imported directly in some places.

### Types

All shared TypeScript interfaces live in `src/types/index.ts`:
- `Review` — individual review with id, rating, title, content, version, country
- `App` — app metadata including screenshots, pricing, bundle info
- `PopularApp` — extends `App` with a `rank` field
- `ReviewsResponse` — reviews array + totalCount, averageRating, ratingDistribution
- `KeywordData` — word, count, sentiment, avgRating
- `Country` — code, name, flag
- `COUNTRIES` — constant array of 9 supported countries (also defined in this file)

## Key Conventions

- Path alias `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Default country is `'se'` (Sweden) in the dashboard UI
- Images from `*.mzstatic.com` are whitelisted in `next.config.ts` for `next/image`
- Genre IDs for iTunes categories are defined in `src/lib/itunes.ts` as `GENRE_IDS`
- The dashboard uses four tabs: `analytics`, `keywords`, `regions`, `compare` (type `TabView`)
- Review filtering/sorting is done client-side with `useMemo` in the dashboard
- App comparison supports up to 3 apps

## Key Features

1. **App Search** — Search iOS apps by name across 9 regions
2. **Screenshots Gallery** — View iPhone/iPad screenshots
3. **Review Analytics** — Rating trends, sentiment breakdown, version analysis
4. **Keyword Analysis** — Extract topics and pain points from reviews
5. **Multi-Region Comparison** — Compare ratings across countries
6. **App Comparison** — Side-by-side comparison of up to 3 apps
7. **Export** — Download reviews as CSV or generate PDF reports
8. **Popular Apps** — Browse top apps by category

## Supported Categories

Business, Productivity, Finance, Health & Fitness, Social, Lifestyle, Education, Entertainment, Utilities, Travel, Food & Drink, Shopping, News, Weather, Sports, Music, Photo, Navigation

## Supported Countries

US, GB, CA, AU, SE (default), IN, DE, FR, JP

## Analytics

Analytics are optional — configured via `NEXT_PUBLIC_*` environment variables. Supports Umami, Plausible, Google Analytics, and PostHog. The `trackEvent()` helper in `src/components/Analytics.tsx` dispatches to whichever providers are configured.

**Environment variables:**
```
NEXT_PUBLIC_UMAMI_WEBSITE_ID / NEXT_PUBLIC_UMAMI_URL          # Umami
NEXT_PUBLIC_PLAUSIBLE_DOMAIN / NEXT_PUBLIC_PLAUSIBLE_URL      # Plausible
NEXT_PUBLIC_GA_ID                                              # Google Analytics
NEXT_PUBLIC_POSTHOG_KEY / NEXT_PUBLIC_POSTHOG_HOST            # PostHog
NEXT_PUBLIC_SITE_URL                                           # Base URL for SEO meta tags
```

**Events tracked:**
- `app_search` — User searches for an app
- `app_selected` — User selects an app (with `source: 'search'` or `'popular'`)
- `app_selected_homepage` — User clicks app from homepage
- `tab_switched` — User switches analytics tab
- `app_added_to_compare` — User adds app to comparison
- `cta_clicked` — User clicks call-to-action button
- `search_results` — Search completed (with result count)

## SEO

- Comprehensive meta tags in `layout.tsx` (Open Graph, Twitter Card, robots, icons, manifest)
- `metadataBase` set from `NEXT_PUBLIC_SITE_URL` env var (defaults to `https://pikanreview.com`)
- Preconnects to `itunes.apple.com` for performance
- Uses Geist and Geist Mono fonts via `next/font/google`

## Development Notes

- Both pages (`page.tsx` and `dashboard/page.tsx`) are `'use client'` components
- The dashboard wraps `useSearchParams()` in a `Suspense` boundary to avoid SSR issues
- Reviews are fetched in parallel using `Promise.all` across 10 pages
- The popular apps endpoint first fetches the RSS top chart, then does a batch `lookup` call with all IDs to enrich with ratings
- `fetchAppAcrossRegions()` in `itunes.ts` supports fetching app data for multiple countries in parallel (used by RegionComparison)
- Screenshots arrays come in two variants: `screenshotUrls` (iPhone) and `ipadScreenshotUrls`
- The HTML report generator in `export.ts` still references "ReviewSpy" (old branding) in the footer
