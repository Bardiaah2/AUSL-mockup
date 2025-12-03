import { NextResponse, NextRequest } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log(`[auth/login] Attempting login for user: ${username}`);

    // Call backend login endpoint
    const backendUrl = `${BACKEND_URL}/api/login`;
    console.log(`[auth/login] Contacting backend at: ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error(`[auth/login] Backend returned error: ${response.status}`, errorData);
      
      return NextResponse.json(
        { error: errorData.error || 'Invalid username or password' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[auth/login] ✓ Login successful for user: ${username}`);

    // Get the session_id cookie from backend response if present
    const setCookieHeader = response.headers.get('set-cookie');
    
    // Create response with success message
    const nextResponse = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    // Forward the session cookie from backend if it exists
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[auth/login] Error during login:`, error);
    
    return NextResponse.json(
      { error: `Login error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
