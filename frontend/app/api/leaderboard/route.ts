import { NextResponse } from 'next/server';

// Backend API URL - adjust this to match your Flask backend URL
// Set BACKEND_URL in your .env.local file
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET() {
  try {
    // Fetch combined points from Flask backend
    const response = await fetch(`${BACKEND_URL}/api/points`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control for development
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle empty or invalid data
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'No leaderboard data available' },
        { status: 404 }
      );
    }
    
    // Transform backend data to leaderboard format
    const leaderboardData = data
      .map((player: any, index: number) => {
        // Calculate stat points (hitting + pitching)
        const statPts = (player.HittingPoints || 0) + (player.PitchingPoints || 0);
        
        // For now, we'll use calculated values for missing fields
        // These can be extended when backend provides more data
        const totalPts = player.TotalPoints || statPts;
        
        // Calculate win points (estimated as 60% of total if not provided)
        // This is a placeholder - should come from backend
        const winPts = Math.round(totalPts * 0.6);
        
        // MVP points placeholder
        const mvpPts = Math.round(totalPts * 0.1);
        
        return {
          rank: index + 1,
          change: "–", // Placeholder - should come from backend
          athlete: player.Athlete || 'Unknown',
          jersey: `#${(index % 99) + 1}`, // Placeholder
          headshot: `https://resource.auprosports.com/prod/players/${index + 1}.png`, // Placeholder
          team: `Team ${player.Athlete?.split(',')[0] || 'Unknown'}`, // Placeholder
          position: player.Position || 'IF', // Should come from backend
          totalPts: totalPts,
          delta: "–", // should be calculated here
          games: player.Games || 10, // Placeholder
          winPts: winPts,
          statPts: statPts,
          mvpPts: mvpPts,
          // Include raw backend data for reference
          _raw: {
            HittingPoints: player.HittingPoints || 0,
            PitchingPoints: player.PitchingPoints || 0,
            TotalPoints: player.TotalPoints || 0,
          },
        };
      })
      // Sort by total points descending
      .sort((a: any, b: any) => b.totalPts - a.totalPts)
      // Re-rank after sorting
      .map((player: any, index: number) => ({
        ...player,
        rank: index + 1,
      }));

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to fetch leaderboard data',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

