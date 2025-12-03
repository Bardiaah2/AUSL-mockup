'use client';

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FilterPanel from "./components/FilterPanel";
import LeaderboardTable from "./components/LeaderboardTable";
import StatusGrid from "./components/StatusGrid";
import ProtectedPlayers from "./components/ProtectedPlayers";
import NewsMarquee from "./components/NewsMarquee";
import CTASection from "./components/CTASection";
import ProtectedPage from "./components/ProtectedPage";
import { LeaderboardRow } from "./types";
import { getLeaderboard } from "./lib/api";
import { fallbackLeaderboardRows } from "./tmp/fallbackData";

export default function Page() {
  const [leaderboardRows, setLeaderboardRows] = useState<LeaderboardRow[]>(fallbackLeaderboardRows);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getLeaderboard();
        setLeaderboardRows(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setError('Failed to load leaderboard data. Showing cached data.');
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <ProtectedPage>
      <main className="page">
        <div className="page__glow" aria-hidden />
        <Header />
        <Hero />
        <FilterPanel />
        {isLoading && (
          <section className="leaderboard-card">
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading leaderboard...
            </div>
          </section>
        )}
        {!isLoading && (
          <>
            <LeaderboardTable leaderboardRows={leaderboardRows} />
            {error && (
              <div style={{ 
                padding: '1rem', 
                margin: '1rem 0', 
                background: 'rgba(248, 113, 113, 0.1)', 
                border: '1px solid var(--danger)',
                borderRadius: '0.5rem',
                color: 'var(--danger)',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}
          </>
        )}
        <StatusGrid />
        <ProtectedPlayers />
        <NewsMarquee />
        <CTASection />
      </main>
    </ProtectedPage>
  );
}

