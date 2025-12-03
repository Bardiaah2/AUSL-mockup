import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint that verifies if user has a valid session.
 * Used by ProtectedPage to determine if user is authenticated.
 */
export async function GET(request: NextRequest) {
  try {
    // Check if session_id cookie exists
    const sessionCookie = request.cookies.get('session_id');

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false, error: 'No session found' },
        { status: 401 }
      );
    }

    // Session exists
    return NextResponse.json(
      { authenticated: true, message: 'Session valid' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[auth/check] Error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Auth check failed' },
      { status: 500 }
    );
  }
}
