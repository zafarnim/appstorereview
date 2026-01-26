import { Review, ReviewsResponse } from '@/types';

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

// Search for apps by name
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
    icon: app.artworkUrl100,
    developer: app.artistName,
    rating: app.averageUserRating || 0,
    reviewCount: app.userRatingCount || 0,
    category: app.primaryGenreName,
  }));
}

interface iTunesAppResult {
  trackId: number;
  trackName: string;
  artworkUrl100: string;
  artistName: string;
  averageUserRating?: number;
  userRatingCount?: number;
  primaryGenreName: string;
}

interface App {
  id: string;
  name: string;
  icon: string;
  developer: string;
  rating: number;
  reviewCount: number;
  category: string;
}
