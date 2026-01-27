export interface Review {
  id: string;
  appName: string;
  appId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  country: string;
  version?: string;
  helpful?: number;
  developerResponse?: {
    body: string;
    modified: string;
  };
}

export interface App {
  id: string;
  name: string;
  icon: string;
  developer: string;
  rating: number;
  reviewCount: number;
  category: string;
  // Enhanced fields
  screenshotUrls?: string[];
  ipadScreenshotUrls?: string[];
  version?: string;
  releaseDate?: string;
  currentVersionReleaseDate?: string;
  contentRating?: string;
  price?: number;
  formattedPrice?: string;
  description?: string;
  releaseNotes?: string;
  bundleId?: string;
  minimumOsVersion?: string;
  fileSizeBytes?: string;
  developerId?: string;
  developerUrl?: string;
  sellerUrl?: string;
  genres?: string[];
  trackUrl?: string;
}

export interface PopularApp extends App {
  rank: number;
}

export interface RegionStats {
  country: string;
  countryName: string;
  flag: string;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
}

export interface KeywordData {
  word: string;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  avgRating: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  totalCount: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'se', name: 'Sweden', flag: '🇸🇪' },
  { code: 'in', name: 'India', flag: '🇮🇳' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
];
