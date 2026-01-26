import { NextRequest, NextResponse } from 'next/server';
import { searchApps } from '@/lib/itunes';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const country = searchParams.get('country') || 'us';

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    const apps = await searchApps(query, country);
    return NextResponse.json({ apps });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search apps' },
      { status: 500 }
    );
  }
}
