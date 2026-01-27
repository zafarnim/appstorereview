import { NextRequest, NextResponse } from 'next/server';
import { fetchPopularApps, GenreType, GENRE_IDS } from '@/lib/itunes';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const genre = searchParams.get('genre') || 'business';
  const country = searchParams.get('country') || 'us';
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  // Validate genre
  const validGenre = genre in GENRE_IDS ? (genre as GenreType) : 'business';

  try {
    const apps = await fetchPopularApps(validGenre, country, Math.min(limit, 50));
    return NextResponse.json({ apps });
  } catch (error) {
    console.error('Error fetching popular apps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular apps', apps: [] },
      { status: 500 }
    );
  }
}
