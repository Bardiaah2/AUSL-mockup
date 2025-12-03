import { NextResponse } from 'next/server';
import type { LeaderboardRow } from '@/app/types';

// Backend API URL - adjust this to match your Flask backend URL
// Set BACKEND_URL in your .env.local file
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

interface PointsData {
  Athlete: string;
  HittingPoints: number;
  PitchingPoints: number;
  MVPPoints: number;
  WINPoints: number;
  TotalPoints: number;
}

interface HittingStatsData {
  Athlete: string;
  '1B': number;
  '2B': number;
  '3B': number;
  'HR': number;
  'SB': number;
  'CS': number;
  'BB': number;
  'HP': number;
  'SF': number;
  'SH': number;
  'G': number;
  Points: number;
}

interface PitchingStatsData {
  Athlete: string;
  'IP': number | string;
  'ER': number;
  'G': number;
  Points: number;
}

interface MVPData {
  Athlete: string;
  '1st': number;
  '2nd': number;
  '3rd': number;
  'D MVP': number;
  'Total MVP': number;
}

interface WinData {
  Athlete: string;
  'Innings Won': number;
  'Games Won': number;
  'Total Win': number;
}

interface PlayerInfoData {
  name: string;
  picture_url: string;
  bio_url: string;
  position: string;
  rank_change: number | string;
}

async function fetchFromBackend<T>(endpoint: string): Promise<T[]> {
  const url = `${BACKEND_URL}${endpoint}`;
  console.log(`[leaderboard] Fetching: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[leaderboard] ✓ ${endpoint} - ${Array.isArray(data) ? data.length : '1'} records`);
    return data;
  } catch (err) {
    console.error(`[leaderboard] ✗ Error fetching ${endpoint}:`, err);
    throw err;
  }
}

function calculateGames(hittingStats: HittingStatsData | undefined, pitchingStats: PitchingStatsData | undefined): number {
  const hGames = hittingStats?.G || 0;
  const pGames = pitchingStats?.G || 0;
  return Math.max(hGames, pGames) || 0;
}

function extractStatBreakdown(hitting: HittingStatsData | undefined, pitching: PitchingStatsData | undefined) {
  if (!hitting && !pitching) {
    return {
      singles: 0,
      doubles: 0,
      triples: 0,
      homeRuns: 0,
      stolenBases: 0,
      caughtStealing: 0,
      walks: 0,
      hitByPitch: 0,
      sacrifices: 0,
      sacfly: 0,
      sacbunt: 0,
      outs: 0,
      allowedRuns: 0,
    };
  }

  // Parse IP (innings pitched) to calculate outs
  let outs = 0;
  if (pitching?.IP) {
    const ipStr = String(pitching.IP);
    const [innings, fractional] = ipStr.split('.');
    const inningNum = parseInt(innings) || 0;
    const fractionalOuts = parseInt(fractional?.charAt(0) || '0') || 0;
    outs = inningNum * 3 + fractionalOuts;
  }

  return {
    singles: hitting?.['1B'] || 0,
    doubles: hitting?.['2B'] || 0,
    triples: hitting?.['3B'] || 0,
    homeRuns: hitting?.['HR'] || 0,
    stolenBases: hitting?.['SB'] || 0,
    caughtStealing: hitting?.['CS'] || 0,
    walks: hitting?.['BB'] || 0,
    hitByPitch: hitting?.['HP'] || 0,
    sacrifices: (hitting?.['SF'] || 0) + (hitting?.['SH'] || 0),
    sacfly: hitting?.['SF'] || 0,
    sacbunt: hitting?.['SH'] || 0,
    outs,
    allowedRuns: pitching?.['ER'] || 0,
  };
}

export async function GET() {
  try {
    console.log(`[leaderboard] Starting fetch from BACKEND_URL: ${BACKEND_URL}`);
    
    // Fetch all data in parallel
    const [pointsData, hittingData, pitchingData, mvpData, winData, playerInfoData] = await Promise.all([
      fetchFromBackend<PointsData>('/api/points'),
      fetchFromBackend<HittingStatsData>('/api/hittingstats'),
      fetchFromBackend<PitchingStatsData>('/api/pitchingstats'),
      fetchFromBackend<MVPData>('/api/mvp'),
      fetchFromBackend<WinData>('/api/win'),
      fetchFromBackend<PlayerInfoData>('/api/player_info'),
    ]);

    if (!pointsData || pointsData.length === 0) {
      return NextResponse.json(
        { error: 'No leaderboard data available' },
        { status: 404 }
      );
    }

    // Index the data for faster lookup
    const hittingMap = new Map(hittingData.map((h) => [h.Athlete, h]));
    const pitchingMap = new Map(pitchingData.map((p) => [p.Athlete, p]));
    const mvpMap = new Map(mvpData.map((m) => [m.Athlete, m]));
    const winMap = new Map(winData.map((w) => [w.Athlete, w]));
    // Normalize player_info names by removing trailing periods for matching
    const playerInfoMap = new Map(playerInfoData.map((p) => [p.name.replace(/\.$/, ''), p]));

    // Transform points data into leaderboard rows
    const leaderboard: LeaderboardRow[] = pointsData.map((player) => {
      const hitting = hittingMap.get(player.Athlete);
      const pitching = pitchingMap.get(player.Athlete);
      const mvp = mvpMap.get(player.Athlete);
      const win = winMap.get(player.Athlete);
      const playerInfo = playerInfoMap.get(player.Athlete);

      const games = calculateGames(hitting, pitching);
      const statBreakdown = extractStatBreakdown(hitting, pitching);

      // Format rank change: add "+" prefix for positive numbers
      let rankChangeStr = '–';
      if (playerInfo?.rank_change) {
        const changeVal = playerInfo.rank_change;
        if (typeof changeVal === 'number') {
          rankChangeStr = changeVal > 0 ? `+${changeVal}` : String(changeVal);
        } else if (changeVal !== '–' && changeVal !== '—') {
          // If it's a string number, parse and format
          const num = parseInt(String(changeVal), 10);
          rankChangeStr = !isNaN(num) && num > 0 ? `+${num}` : String(changeVal);
        }
      }

      return {
        rank: 0, // Will be set after sorting
        change: rankChangeStr,
        athlete: player.Athlete || 'Unknown',
        headshot: playerInfo?.picture_url || '',
        bio_url: playerInfo?.bio_url || '',
        team: '', // Not provided by backend
        position: playerInfo?.position || 'IF',
        totalPts: player.TotalPoints || 0,
        delta: '–', // Will be calculated after sorting
        games,
        winPts: player.WINPoints || 0,
        statPts: (player.HittingPoints || 0) + (player.PitchingPoints || 0),
        mvpPts: player.MVPPoints || 0,
        _raw: {
          MVP1Points: mvp?.['1st'] || 0,
          MVP2Points: mvp?.['2nd'] || 0,
          MVP3Points: mvp?.['3rd'] || 0,
          MVPDefensePoints: mvp?.['D MVP'] || 0,
          InningsWon: win?.['Innings Won'] || 0,
          Wins: win?.['Games Won'] || 0,
          ...statBreakdown,
        },
      };
    });

    // Sort by total points descending
    leaderboard.sort((a, b) => b.totalPts - a.totalPts);

    // Assign ranks and calculate deltas
    const finalLeaderboard = leaderboard.map((player, index) => {
      const previousPlayer = index > 0 ? leaderboard[index - 1] : null;
      const delta = previousPlayer ? previousPlayer.totalPts - player.totalPts : 0;

      return {
        ...player,
        rank: index + 1,
        delta: delta > 0 ? `+${delta}` : '–',
      };
    });

    return NextResponse.json(finalLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to fetch leaderboard data',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

