import { Review, ReviewsResponse } from '@/types';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

interface N8nRequestParams {
  appId?: string;
  appName?: string;
  country?: string;
  rating?: number;
  limit?: number;
  offset?: number;
}

export async function fetchReviewsFromN8n(params: N8nRequestParams): Promise<ReviewsResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N_WEBHOOK_URL is not configured');
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook error: ${response.status}`);
    }

    const data = await response.json();

    // Transform n8n response to our format if needed
    // Adjust this mapping based on your actual n8n data structure
    const reviews: Review[] = Array.isArray(data) ? data : data.reviews || [];

    const ratingDistribution = calculateRatingDistribution(reviews);
    const averageRating = calculateAverageRating(reviews);

    return {
      reviews,
      totalCount: reviews.length,
      averageRating,
      ratingDistribution,
    };
  } catch (error) {
    console.error('Error fetching from n8n:', error);
    throw error;
  }
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
