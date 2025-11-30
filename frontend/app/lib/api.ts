import { LeaderboardRow } from '../types';
import { GET } from '../api/leaderboard/route';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  try {
    const response = await GET();

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

