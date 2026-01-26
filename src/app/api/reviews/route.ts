import { NextRequest, NextResponse } from 'next/server';
import { fetchAllReviews } from '@/lib/itunes';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const appId = searchParams.get('appId');
  const country = searchParams.get('country') || 'us';

  if (!appId) {
    return NextResponse.json(
      { error: 'appId is required' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchAllReviews(appId, country, 10); // 10 pages = up to 500 reviews
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
