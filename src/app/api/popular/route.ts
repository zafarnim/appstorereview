import { NextRequest, NextResponse } from 'next/server';
import { fetchPopularApps } from '@/lib/itunes';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const genre = searchParams.get('genre') as 'business' | 'productivity' || 'business';
  const country = searchParams.get('country') || 'us';
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const apps = await fetchPopularApps(genre, country, Math.min(limit, 50));
    return NextResponse.json({ apps });
  } catch (error) {
    console.error('Error fetching popular apps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular apps', apps: [] },
      { status: 500 }
    );
  }
}
