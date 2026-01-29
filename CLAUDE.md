# Pikan Review - App Store Review Analytics

## Project Overview
Pikan Review is a Next.js application for analyzing iOS App Store reviews. It fetches real-time data from the iTunes API to provide insights on app ratings, sentiment, keywords, and regional performance.

## Tech Stack
- **Framework:** Next.js 16.1.4 with App Router
- **React:** 19.2.3
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript 5
- **Analytics:** Vercel Analytics & Speed Insights

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
│   └── index.ts                # Component exports
├── lib/
│   ├── export.ts               # CSV/PDF export utilities
│   ├── itunes.ts               # iTunes API integration
│   └── textAnalysis.ts         # Keyword extraction
└── types/
    └── index.ts                # TypeScript interfaces
```

## Key Commands
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Key Features
1. **App Search** - Search iOS apps by name across 9 regions
2. **Screenshots Gallery** - View iPhone/iPad screenshots
3. **Review Analytics** - Rating trends, sentiment breakdown, version analysis
4. **Keyword Analysis** - Extract topics and pain points from reviews
5. **Multi-Region Comparison** - Compare ratings across countries
6. **App Comparison** - Side-by-side comparison of up to 3 apps
7. **Export** - Download reviews as CSV or generate PDF reports
8. **Popular Apps** - Browse top apps by category (12 categories)

## API Endpoints
- `GET /api/search?q={query}&country={code}` - Search apps
- `GET /api/reviews?appId={id}&country={code}` - Get reviews
- `GET /api/lookup?appId={id}&country={code}` - Get app details
- `GET /api/popular?genre={category}&country={code}` - Top charts

## Supported Categories
Business, Productivity, Finance, Health & Fitness, Social, Lifestyle, Education, Entertainment, Utilities, Travel, Food & Drink, Shopping

## Supported Countries
US, GB, CA, AU, SE (default), IN, DE, FR, JP

## Data Sources
All data is fetched from Apple's iTunes API:
- Search API: `https://itunes.apple.com/search`
- Lookup API: `https://itunes.apple.com/lookup`
- RSS Reviews: `https://itunes.apple.com/rss/customerreviews`
- RSS Top Charts: `https://itunes.apple.com/rss/topfreeapplications`

## Analytics
Pikan Review supports multiple analytics providers (configure via environment variables):

**Umami (Recommended for self-hosted)**
```
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
NEXT_PUBLIC_UMAMI_URL=https://your-umami-instance.com
```

**Plausible**
```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=pikanreview.com
NEXT_PUBLIC_PLAUSIBLE_URL=https://plausible.io  # or your self-hosted URL
```

**Google Analytics**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**PostHog**
```
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com  # or your self-hosted URL
```

Events tracked:
- `app_search` - User searches for an app
- `app_selected` - User selects an app to analyze
- `app_selected_homepage` - User clicks app from homepage
- `tab_switched` - User switches analytics tab
- `app_added_to_compare` - User adds app to comparison
- `cta_clicked` - User clicks call-to-action button

## SEO
- Comprehensive meta tags in layout.tsx
- Open Graph and Twitter Card support
- robots.txt and sitemap support
- Semantic HTML structure

## Development Notes
- App uses client-side rendering for the dashboard (`'use client'`)
- iTunes API responses are cached for 5-10 minutes
- Reviews are fetched in parallel (up to 10 pages = 500 reviews)
- Screenshots support both iPhone and iPad variants
- Default country is Sweden (SE)
