import { NextRequest, NextResponse } from 'next/server';
import { lookupApp } from '@/lib/itunes';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const appId = searchParams.get('appId');
  const country = searchParams.get('country') || 'us';

  if (!appId) {
    return NextResponse.json(
      { error: 'appId is required', app: null },
      { status: 400 }
    );
  }

  try {
    const app = await lookupApp(appId, country);
    return NextResponse.json({ app });
  } catch (error) {
    console.error('Error looking up app:', error);
    return NextResponse.json(
      { error: 'Failed to lookup app', app: null },
      { status: 500 }
    );
  }
}
