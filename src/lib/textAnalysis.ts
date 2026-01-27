import { Review, KeywordData } from '@/types';

// Common stop words to filter out
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'under', 'over', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now',
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
  'did', 'doing', 'would', 'could', 'ought', 'im', 'youre', 'hes', 'shes', 'its',
  'were', 'theyre', 'ive', 'youve', 'weve', 'theyve', 'id', 'youd', 'hed', 'shed',
  'wed', 'theyd', 'ill', 'youll', 'hell', 'shell', 'well', 'theyll', 'isnt', 'arent',
  'wasnt', 'werent', 'hasnt', 'havent', 'hadnt', 'doesnt', 'dont', 'didnt', 'wont',
  'wouldnt', 'cant', 'couldnt', 'shouldnt', 'mightnt', 'mustnt', 'app', 'really',
  'like', 'get', 'got', 'one', 'use', 'used', 'using', 'thing', 'things', 'good',
  'great', 'best', 'well', 'much', 'even', 'also', 'way', 'back', 'still', 'lot',
  'every', 'need', 'want', 'make', 'made', 'time', 'first', 'new', 'work', 'works',
  'working', 'just', 'know', 'take', 'people', 'year', 'years', 'day', 'days',
  'love', 'loved', 'amazing', 'awesome', 'terrible', 'horrible', 'bad', 'worst',
]);

// Common bigrams and trigrams to identify
const COMMON_PHRASES = [
  'customer service', 'customer support', 'tech support', 'user interface',
  'user experience', 'easy to use', 'hard to use', 'bug fix', 'bug fixes',
  'new feature', 'new features', 'feature request', 'doesnt work', 'does not work',
  'not working', 'stopped working', 'keeps crashing', 'battery drain', 'battery life',
  'dark mode', 'night mode', 'push notification', 'push notifications',
  'in app purchase', 'in app purchases', 'free trial', 'subscription',
  'customer feedback', 'loading time', 'load time', 'sign in', 'log in', 'sign out',
  'log out', 'data loss', 'sync issue', 'sync issues', 'privacy concern', 'security',
];

interface WordInfo {
  count: number;
  totalRating: number;
  reviews: Set<string>;
}

export function extractKeywords(reviews: Review[], minCount: number = 3): KeywordData[] {
  const wordMap = new Map<string, WordInfo>();

  for (const review of reviews) {
    const text = `${review.title} ${review.content}`.toLowerCase();

    // Clean and tokenize
    const words = text
      .replace(/[^\w\s'-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !STOP_WORDS.has(word) && !/^\d+$/.test(word));

    // Count unique words per review to avoid inflation
    const uniqueWords = new Set(words);

    for (const word of uniqueWords) {
      const info = wordMap.get(word) || { count: 0, totalRating: 0, reviews: new Set() };
      info.count++;
      info.totalRating += review.rating;
      info.reviews.add(review.id);
      wordMap.set(word, info);
    }

    // Extract bigrams (two-word phrases)
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      if (COMMON_PHRASES.includes(bigram)) {
        const info = wordMap.get(bigram) || { count: 0, totalRating: 0, reviews: new Set() };
        if (!info.reviews.has(review.id)) {
          info.count++;
          info.totalRating += review.rating;
          info.reviews.add(review.id);
          wordMap.set(bigram, info);
        }
      }
    }
  }

  // Convert to array and calculate sentiment
  const keywords: KeywordData[] = [];

  for (const [word, info] of wordMap) {
    if (info.count >= minCount) {
      const avgRating = info.totalRating / info.count;
      keywords.push({
        word,
        count: info.count,
        avgRating: Math.round(avgRating * 10) / 10,
        sentiment: avgRating >= 4 ? 'positive' : avgRating >= 3 ? 'neutral' : 'negative',
      });
    }
  }

  // Sort by count descending
  return keywords.sort((a, b) => b.count - a.count);
}

export function getTopKeywords(reviews: Review[], limit: number = 50): KeywordData[] {
  const keywords = extractKeywords(reviews, 2);
  return keywords.slice(0, limit);
}

export function getPainPoints(reviews: Review[], limit: number = 20): KeywordData[] {
  // Filter for negative reviews
  const negativeReviews = reviews.filter(r => r.rating <= 2);
  const keywords = extractKeywords(negativeReviews, 2);
  return keywords
    .filter(k => k.sentiment === 'negative')
    .slice(0, limit);
}

export function getFeatureRequests(reviews: Review[]): string[] {
  const featureIndicators = [
    'please add', 'would be nice', 'wish there was', 'should have',
    'need to add', 'want to see', 'feature request', 'suggestion',
    'would love', 'hoping for', 'it would help', 'missing feature',
  ];

  const requests: string[] = [];

  for (const review of reviews) {
    const text = `${review.title} ${review.content}`.toLowerCase();

    for (const indicator of featureIndicators) {
      if (text.includes(indicator)) {
        // Extract sentence containing the indicator
        const sentences = review.content.split(/[.!?]+/);
        for (const sentence of sentences) {
          if (sentence.toLowerCase().includes(indicator)) {
            const trimmed = sentence.trim();
            if (trimmed.length > 10 && trimmed.length < 200 && !requests.includes(trimmed)) {
              requests.push(trimmed);
            }
          }
        }
      }
    }
  }

  return requests.slice(0, 20);
}

export function filterReviewsByKeyword(reviews: Review[], keyword: string): Review[] {
  const lowerKeyword = keyword.toLowerCase();
  return reviews.filter(review => {
    const text = `${review.title} ${review.content}`.toLowerCase();
    return text.includes(lowerKeyword);
  });
}
