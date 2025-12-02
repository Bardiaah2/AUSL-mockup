import { LeaderboardRow } from '../types';

// Use the public API base (must start with NEXT_PUBLIC_ to be available client-side)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  try {
    // Call the Next.js route via HTTP rather than importing the server handler.
    const response = await fetch(`${API_BASE_URL}/leaderboard`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Ensure fresh data in development; adjust caching as needed
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText || '');
      throw new Error(`Failed to fetch leaderboard: ${response.status} ${text}`);
    }

    const data = (await response.json()) as LeaderboardRow[];
    return data;
  } catch (error) {
    // Keep error logging concise but useful
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

