import { Review, ReviewsResponse, App, PopularApp } from '@/types';

interface FetchReviewsParams {
  appId: string;
  country?: string;
  page?: number;
}

interface iTunesReviewEntry {
  id: { label: string };
  title: { label: string };
  content: { label: string };
  'im:rating': { label: string };
  'im:version': { label: string };
  author: { name: { label: string } };
  updated: { label: string };
}

interface iTunesResponse {
  feed: {
    entry?: iTunesReviewEntry[];
  };
}

export async function fetchReviewsFromiTunes(params: FetchReviewsParams): Promise<Review[]> {
  const { appId, country = 'us', page = 1 } = params;

  const url = `https://itunes.apple.com/rss/customerreviews/page=${page}/id=${appId}/sortby=mostrecent/json?cc=${country}`;

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`iTunes API error: ${response.status}`);
  }

  const data: iTunesResponse = await response.json();

  if (!data.feed?.entry) {
    return [];
  }

  return data.feed.entry.map((entry) => ({
    id: entry.id.label,
    appId,
    appName: '',
    userName: entry.author.name.label,
    rating: parseInt(entry['im:rating'].label, 10),
    title: entry.title.label,
    content: entry.content.label,
    date: entry.updated.label,
    country,
    version: entry['im:version'].label,
  }));
}

export async function fetchAllReviews(
  appId: string,
  country: string = 'us',
  maxPages: number = 5
): Promise<ReviewsResponse> {
  const allReviews: Review[] = [];

  // Fetch multiple pages in parallel
  const pagePromises = Array.from({ length: maxPages }, (_, i) =>
    fetchReviewsFromiTunes({ appId, country, page: i + 1 }).catch(() => [])
  );

  const pageResults = await Promise.all(pagePromises);
  pageResults.forEach((reviews) => allReviews.push(...reviews));

  const ratingDistribution = calculateRatingDistribution(allReviews);
  const averageRating = calculateAverageRating(allReviews);

  return {
    reviews: allReviews,
    totalCount: allReviews.length,
    averageRating,
    ratingDistribution,
  };
}

function calculateRatingDistribution(reviews: Review[]): ReviewsResponse['ratingDistribution'] {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((review) => {
    const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });

  return distribution;
}

function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

// Search for apps by name with enhanced details
export async function searchApps(query: string, country: string = 'us'): Promise<App[]> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=${country}&media=software&entity=software&limit=10`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`iTunes Search API error: ${response.status}`);
  }

  const data = await response.json();

  return data.results.map((app: iTunesAppResult) => ({
    id: app.trackId.toString(),
    name: app.trackName,
    icon: app.artworkUrl512 || app.artworkUrl100,
    developer: app.artistName,
    rating: app.averageUserRating || 0,
    reviewCount: app.userRatingCount || 0,
    category: app.primaryGenreName,
    // Enhanced fields
    screenshotUrls: app.screenshotUrls || [],
    ipadScreenshotUrls: app.ipadScreenshotUrls || [],
    version: app.version,
    releaseDate: app.releaseDate,
    currentVersionReleaseDate: app.currentVersionReleaseDate,
    contentRating: app.contentAdvisoryRating || app.trackContentRating,
    price: app.price,
    formattedPrice: app.formattedPrice,
    description: app.description,
    releaseNotes: app.releaseNotes,
    bundleId: app.bundleId,
    minimumOsVersion: app.minimumOsVersion,
    fileSizeBytes: app.fileSizeBytes,
    developerId: app.artistId?.toString(),
    developerUrl: app.artistViewUrl,
    sellerUrl: app.sellerUrl,
    genres: app.genres,
    trackUrl: app.trackViewUrl,
  }));
}

// Lookup a specific app by ID with full details
export async function lookupApp(appId: string, country: string = 'us'): Promise<App | null> {
  const url = `https://itunes.apple.com/lookup?id=${appId}&country=${country}`;

  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`iTunes Lookup API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const app = data.results[0];
  return {
    id: app.trackId.toString(),
    name: app.trackName,
    icon: app.artworkUrl512 || app.artworkUrl100,
    developer: app.artistName,
    rating: app.averageUserRating || 0,
    reviewCount: app.userRatingCount || 0,
    category: app.primaryGenreName,
    screenshotUrls: app.screenshotUrls || [],
    ipadScreenshotUrls: app.ipadScreenshotUrls || [],
    version: app.version,
    releaseDate: app.releaseDate,
    currentVersionReleaseDate: app.currentVersionReleaseDate,
    contentRating: app.contentAdvisoryRating || app.trackContentRating,
    price: app.price,
    formattedPrice: app.formattedPrice,
    description: app.description,
    releaseNotes: app.releaseNotes,
    bundleId: app.bundleId,
    minimumOsVersion: app.minimumOsVersion,
    fileSizeBytes: app.fileSizeBytes,
    developerId: app.artistId?.toString(),
    developerUrl: app.artistViewUrl,
    sellerUrl: app.sellerUrl,
    genres: app.genres,
    trackUrl: app.trackViewUrl,
  };
}

// Genre IDs for iTunes API
export const GENRE_IDS: Record<string, number> = {
  business: 6000,
  productivity: 6007,
  finance: 6015,
  health: 6013,
  social: 6005,
  lifestyle: 6012,
  education: 6017,
  entertainment: 6016,
  utilities: 6002,
  travel: 6003,
  food: 6023,
  shopping: 6024,
  news: 6009,
  weather: 6001,
  sports: 6004,
  music: 6011,
  photo: 6008,
  navigation: 6010,
};

export type GenreType = keyof typeof GENRE_IDS;

// Fetch popular/top apps from iTunes RSS feeds
export async function fetchPopularApps(
  genre: GenreType = 'business',
  country: string = 'us',
  limit: number = 20
): Promise<PopularApp[]> {
  const genreId = GENRE_IDS[genre] || 6000;

  const url = `https://itunes.apple.com/rss/topfreeapplications/limit=${limit}/genre=${genreId}/json?cc=${country}`;

  const response = await fetch(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });

  if (!response.ok) {
    throw new Error(`iTunes RSS API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.feed?.entry) {
    return [];
  }

  // The RSS feed has limited data, so we need to look up full details
  const apps: PopularApp[] = data.feed.entry.map((entry: iTunesRSSEntry, index: number) => ({
    id: entry.id.attributes['im:id'],
    name: entry['im:name'].label,
    icon: entry['im:image']?.[2]?.label || entry['im:image']?.[0]?.label || '',
    developer: entry['im:artist'].label,
    rating: 0, // Not available in RSS, will be populated by lookup
    reviewCount: 0,
    category: entry.category?.attributes?.label || genre,
    rank: index + 1,
  }));

  // Batch lookup to get ratings (lookup API supports multiple IDs)
  const ids = apps.map(a => a.id).join(',');
  try {
    const lookupUrl = `https://itunes.apple.com/lookup?id=${ids}&country=${country}`;
    const lookupResponse = await fetch(lookupUrl, { next: { revalidate: 600 } });

    if (lookupResponse.ok) {
      const lookupData = await lookupResponse.json();
      const lookupMap = new Map<string, iTunesAppResult>();

      lookupData.results?.forEach((result: iTunesAppResult) => {
        lookupMap.set(result.trackId.toString(), result);
      });

      // Enrich apps with lookup data
      return apps.map(app => {
        const details = lookupMap.get(app.id);
        if (details) {
          return {
            ...app,
            icon: details.artworkUrl512 || details.artworkUrl100 || app.icon,
            rating: details.averageUserRating || 0,
            reviewCount: details.userRatingCount || 0,
            screenshotUrls: details.screenshotUrls || [],
            ipadScreenshotUrls: details.ipadScreenshotUrls || [],
            version: details.version,
            releaseDate: details.releaseDate,
            contentRating: details.contentAdvisoryRating || details.trackContentRating,
            price: details.price,
            formattedPrice: details.formattedPrice,
            description: details.description,
            genres: details.genres,
            trackUrl: details.trackViewUrl,
          };
        }
        return app;
      });
    }
  } catch {
    // If lookup fails, return apps with basic info
  }

  return apps;
}

// Fetch app data across multiple regions
export async function fetchAppAcrossRegions(
  appId: string,
  countries: string[]
): Promise<Map<string, App | null>> {
  const results = new Map<string, App | null>();

  const promises = countries.map(async (country) => {
    try {
      const app = await lookupApp(appId, country);
      return { country, app };
    } catch {
      return { country, app: null };
    }
  });

  const resolved = await Promise.all(promises);
  resolved.forEach(({ country, app }) => {
    results.set(country, app);
  });

  return results;
}

interface iTunesAppResult {
  trackId: number;
  trackName: string;
  artworkUrl100: string;
  artworkUrl512?: string;
  artistName: string;
  artistId?: number;
  artistViewUrl?: string;
  averageUserRating?: number;
  userRatingCount?: number;
  primaryGenreName: string;
  // Enhanced fields
  screenshotUrls?: string[];
  ipadScreenshotUrls?: string[];
  version?: string;
  releaseDate?: string;
  currentVersionReleaseDate?: string;
  contentAdvisoryRating?: string;
  trackContentRating?: string;
  price?: number;
  formattedPrice?: string;
  description?: string;
  releaseNotes?: string;
  bundleId?: string;
  minimumOsVersion?: string;
  fileSizeBytes?: string;
  sellerUrl?: string;
  genres?: string[];
  trackViewUrl?: string;
}

interface iTunesRSSEntry {
  id: { attributes: { 'im:id': string } };
  'im:name': { label: string };
  'im:image': { label: string }[];
  'im:artist': { label: string };
  category?: { attributes?: { label?: string } };
}
