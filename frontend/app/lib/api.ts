'use client';

import { LeaderboardRow } from '../types';

// Use the public API base (must start with NEXT_PUBLIC_ to be available client-side)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface FetchOptions {
  retries?: number;
  timeout?: number;
}

/**
 * Fetches the leaderboard data from the Next.js API route.
 * This function handles communication with the backend through the middleware.
 * @returns Array of LeaderboardRow objects sorted by total points
 * @throws Error if the fetch fails after retries
 */
export async function getLeaderboard(options: FetchOptions = {}): Promise<LeaderboardRow[]> {
  const { retries = 1, timeout = 30000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${API_BASE_URL}/leaderboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText || '');
        throw new Error(
          `Failed to fetch leaderboard: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
        );
      }

      const data = (await response.json()) as LeaderboardRow[];

      // Validate response structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid response: expected an array of LeaderboardRow objects');
      }

      // Ensure all required fields are present
      const validatedData = data.map((row) => {
        if (!row.athlete || row.rank === undefined || row.totalPts === undefined) {
          throw new Error(`Invalid leaderboard row: missing required fields for ${row.athlete || 'unknown athlete'}`);
        }
        return row;
      });

      console.log(`Successfully fetched leaderboard with ${validatedData.length} players`);
      return validatedData;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < retries) {
        console.warn(`Leaderboard fetch attempt ${attempt + 1} failed, retrying...`, lastError.message);
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  console.error('Error fetching leaderboard after retries:', lastError);
  throw lastError || new Error('Failed to fetch leaderboard');
}

/**
 * Logs in a user with username and password
 * @param username The user's username/email
 * @param password The user's password
 * @returns Success response with session cookie
 * @throws Error if login fails
 */
export async function login(username: string, password: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Include cookies in request/response
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    console.error('Login error:', message);
    throw new Error(message);
  }
}