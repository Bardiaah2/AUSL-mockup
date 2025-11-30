'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import InfoPopup from "./components/infopopup";
import { LeaderboardRow } from "./types";
import { fetchLeaderboard } from "./lib/api";

const primaryNav = [
  "About",
  "Media Guide",
  "Scores",
  "Players",
  "Leaderboard",
  "Stats",
  "News",
  "Shop",
];

const allStarNav = ["All-Star Cup", "Regular Season"];

// Fallback data in case API fails
const fallbackLeaderboardRows: LeaderboardRow[] = [
  {
    rank: 1,
    change: "–",
    athlete: "Kowalik, K.",
    jersey: "#99",
    headshot: "https://resource.auprosports.com/prod/players/933.png",
    team: "Team Kowalik",
    position: "C",
    totalPts: 1590,
    delta: "–",
    games: 10,
    winPts: 990,
    statPts: 300,
    mvpPts: 300,
  },
  {
    rank: 2,
    change: "–",
    athlete: "Garcia, R.",
    jersey: "#00",
    headshot: "https://resource.auprosports.com/prod/players/278.png",
    team: "Team Garcia",
    position: "RHP",
    totalPts: 1448,
    delta: "142",
    games: 8,
    winPts: 680,
    statPts: 488,
    mvpPts: 280,
  },
  {
    rank: 3,
    change: "+1",
    athlete: "Ricketts, K.",
    jersey: "#10",
    headshot: "https://resource.auprosports.com/prod/players/927.png",
    team: "Team Ricketts",
    position: "LHP",
    totalPts: 1184,
    delta: "264",
    games: 10,
    winPts: 820,
    statPts: 264,
    mvpPts: 100,
  },
  {
    rank: 4,
    change: "+1",
    athlete: "Coffel, E.",
    jersey: "#21",
    headshot: "https://resource.auprosports.com/prod/players/937.png",
    team: "Team Coffel",
    position: "IF",
    totalPts: 1172,
    delta: "12",
    games: 10,
    winPts: 860,
    statPts: 232,
    mvpPts: 80,
  },
  {
    rank: 5,
    change: "–2",
    athlete: "Coffey, D.",
    jersey: "#24",
    headshot: "https://resource.auprosports.com/prod/players/1113.png",
    team: "Team Garcia",
    position: "IF",
    totalPts: 1140,
    delta: "32",
    games: 10,
    winPts: 900,
    statPts: 200,
    mvpPts: 40,
  },
  {
    rank: 6,
    change: "+5",
    athlete: "Corrick, G.",
    jersey: "#4",
    headshot: "https://resource.auprosports.com/prod/players/307.png",
    team: "Team Ricketts",
    position: "RHP",
    totalPts: 1096,
    delta: "44",
    games: 10,
    winPts: 610,
    statPts: 286,
    mvpPts: 200,
  },
  {
    rank: 7,
    change: "–1",
    athlete: "Netz, D.",
    jersey: "#35",
    headshot: "https://resource.auprosports.com/prod/players/1098.png",
    team: "Team Kowalik",
    position: "RHP",
    totalPts: 1078,
    delta: "18",
    games: 10,
    winPts: 850,
    statPts: 148,
    mvpPts: 80,
  },
  {
    rank: 8,
    change: "–1",
    athlete: "Otis, K.",
    jersey: "#31",
    headshot: "https://resource.auprosports.com/prod/players/1102.png",
    team: "Team Kowalik",
    position: "OF",
    totalPts: 1058,
    delta: "20",
    games: 10,
    winPts: 810,
    statPts: 208,
    mvpPts: 40,
  },
  {
    rank: 9,
    change: "–1",
    athlete: "Kilfoyl, L.",
    jersey: "#61",
    headshot: "https://resource.auprosports.com/prod/players/949.png",
    team: "Team Garcia",
    position: "RHP",
    totalPts: 994,
    delta: "64",
    games: 8,
    winPts: 690,
    statPts: 164,
    mvpPts: 140,
  },
  {
    rank: 10,
    change: "+5",
    athlete: "Wisz, D.",
    jersey: "#97",
    headshot: "https://resource.auprosports.com/prod/players/657.png",
    team: "Team Coffel",
    position: "IF",
    totalPts: 990,
    delta: "4",
    games: 10,
    winPts: 790,
    statPts: 200,
    mvpPts: "–",
  },
  {
    rank: 11,
    change: "+5",
    athlete: "Lorenz, A.",
    jersey: "#9",
    headshot: "https://resource.auprosports.com/prod/players/159.png",
    team: "Team Coffel",
    position: "OF",
    totalPts: 980,
    delta: "10",
    games: 8,
    winPts: 740,
    statPts: 180,
    mvpPts: 60,
  },
  {
    rank: 12,
    change: "+2",
    athlete: "Ocasio, A.",
    jersey: "#8",
    headshot: "https://resource.auprosports.com/prod/players/10.png",
    team: "Team Kowalik",
    position: "RHP",
    totalPts: 974,
    delta: "6",
    games: 8,
    winPts: 590,
    statPts: 324,
    mvpPts: 60,
  },
  {
    rank: 13,
    change: "–1",
    athlete: "Warren, J.",
    jersey: "#30",
    headshot: "https://resource.auprosports.com/prod/players/30.png",
    team: "Team Garcia",
    position: "IF",
    totalPts: 940,
    delta: "34",
    games: 8,
    winPts: 650,
    statPts: 250,
    mvpPts: 40,
  },
  {
    rank: 14,
    change: "+7",
    athlete: "Hayward, V.",
    jersey: "#1",
    headshot: "https://resource.auprosports.com/prod/players/3.png",
    team: "Team Coffel",
    position: "OF",
    totalPts: 938,
    delta: "2",
    games: 10,
    winPts: 790,
    statPts: 108,
    mvpPts: 40,
  },
  {
    rank: 15,
    change: "–6",
    athlete: "Gold, A.",
    jersey: "#40",
    headshot: "https://resource.auprosports.com/prod/players/1103.png",
    team: "Team Garcia",
    position: "IF",
    totalPts: 926,
    delta: "12",
    games: 10,
    winPts: 730,
    statPts: 156,
    mvpPts: 40,
  },
  {
    rank: 16,
    change: "+2",
    athlete: "Gibson Whorton, D.",
    jersey: "#5",
    headshot: "https://resource.auprosports.com/prod/players/308.png",
    team: "Team Ricketts",
    position: "IF",
    totalPts: 910,
    delta: "16",
    games: 10,
    winPts: 700,
    statPts: 190,
    mvpPts: 20,
  },
];

const filters = {
  series: [
    "2025 All-Star Cup",
    "2024 Championship*",
    "2024 AUX Softball",
    "2023 AUX Softball",
    "2022 AUX Softball",
    "2023 Championship*",
    "2022 Championship*",
    "2021 Championship*",
    "2020 Championship*",
  ],
  scope: ["All Series", "All Games", "All Players"],
};

const statusCallouts = [
  {
    title: "Player Status",
    body: "Leaderboard Champ is crowned at the end of the AUSL All-Star Cup. Weekly drafts, leaderboard bonuses, and protected player rules keep every team in contention.",
  },
  {
    title: "Draft Watch",
    body: "AUSL Draft is live on ESPNU, Dec 1 at 7 PM ET. Spark and Cascade join Bandits, Blaze, Talons, and Volts for a six-team slate next summer.",
  },
  {
    title: "Stay Updated",
    body: "Follow @theauslofficial for real-time protected player announcements, allocation pool reveals, and behind-the-scenes coverage.",
  },
];

const protectedTeams = [
  {
    team: "Bandits",
    players: [
      "Taylor McQuillin",
      "Erin Coffel",
      "Morgan Zerkle",
      "Lexi Kilfoyl",
      "Skylar Wallace",
    ],
  },
  {
    team: "Talons",
    players: [
      "Megan Faraimo",
      "Hannah Flippen",
      "Georgina Corrick",
      "Sharlize Palacios",
      "Montana Fouts",
    ],
  },
  {
    team: "Volts",
    players: [
      "Dejah Mulipola",
      "Mia Scott",
      "Tiare Jennings",
      "Amanda Lorenz",
      "Rachel Garcia",
    ],
  },
  {
    team: "Blaze",
    players: [
      "Ana Gold",
      "Baylee Klingler",
      "Keilani Ricketts",
      "Kayla Kowalik",
      "Aubrey Leach",
    ],
  },
];

const newsTicker = [
  "Spark and Cascade expansion draft slots confirmed.",
  "Allocation pool highlighted by Jocelyn Alo’s return to AU.",
  "Savanna Collins spotlights Maya Brady and Syd McKinney for expansion teams.",
  "MLB Network showcases AUSL award winners at 9 PM ET.",
];


function Header() {
  return (
    <header className="site-header">
      <div className="site-header__upper">
        <div className="logo-lockup">
          <span className="badge">AUSL</span>
          <span className="badge badge--outline">All-Star Cup</span>
        </div>
        <nav className="primary-nav">
          {primaryNav.map((item) => (
            <Link key={item} href="#" className="primary-nav__link">
              {item}
            </Link>
          ))}
        </nav>
        <button className="cta-button">Shop</button>
      </div>
      <div className="site-header__lower">
        <div className="lower-nav">
          {allStarNav.map((item) => (
            <button key={item} className="lower-nav__pill">
              {item}
            </button>
          ))}
        </div>
        <div className="draft-banner">
          <span>Draft Live • Dec 1 • 7 PM ET</span>
          <span>ESPNU</span>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero__text">
        <p className="eyebrow">2025 All-Star Cup</p>
        <h1>Leaderboard</h1>
        <p className="lede">
          Track every win point, stat point, and MVP boost as AUSL athletes
          battle through weekly drafts to claim the Cup. Points reset each week,
          but greatness sticks.
        </p>
      </div>
      <div className="hero__meta">
        <div>
          <p className="stat-label">Current Leader</p>
          <p className="stat-value">Kayla Kowalik</p>
          <p className="stat-sub">1590 pts • Team Kowalik</p>
        </div>
        <div>
          <p className="stat-label">Points Back</p>
          <p className="stat-value">142</p>
          <p className="stat-sub">Rachel Garcia chasing</p>
        </div>
      </div>
    </section>
  );
}

function FilterPanel() {
  return (
    <section className="filter-panel">
      <div className="filter-panel__tabs">
        <button className="filter-tab filter-tab--active">Overview</button>
        <button className="filter-tab">Pts Breakdown</button>
      </div>
      <div className="filter-panel__filters">
        {filters.series.map((item) => (
          <button
            key={item}
            className={`filter-pill ${
              item === "2025 All-Star Cup" ? "filter-pill--active" : ""
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="filter-panel__quick">
        {filters.scope.map((item, index) => (
          <div key={item} className="quick-filter">
            <span>{item}</span>
            {index < filters.scope.length - 1 && <span>•</span>}
          </div>
        ))}
        <button className="link-button">Clear filters</button>
      </div>
    </section>
  );
}

function LeaderboardTable({ leaderboardRows }: { leaderboardRows: LeaderboardRow[] }) {
  const [popupState, setPopupState] = useState<{
    row: LeaderboardRow | null;
    position: { x: number; y: number };
    type: 'stat' | 'win' | 'mvp';
  } | null>(null);

  const handlePointsClick = (
    row: LeaderboardRow, 
    type: 'stat' | 'win' | 'mvp',
    event: React.MouseEvent<HTMLTableCellElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 320;
    const popupHeight = 250;
    
    // Calculate position, ensuring it doesn't go off-screen
    let x = rect.left + rect.width / 2 - popupWidth / 2;
    let y = rect.bottom + 10;
    
    // Adjust if popup would go off right edge
    if (x + popupWidth > window.innerWidth) {
      x = window.innerWidth - popupWidth - 10;
    }
    
    // Adjust if popup would go off left edge
    if (x < 10) {
      x = 10;
    }
    
    // Adjust if popup would go off bottom edge (show above instead)
    if (y + popupHeight > window.innerHeight) {
      y = rect.top - popupHeight - 10;
    }
    
    // Ensure it doesn't go off top edge
    if (y < 10) {
      y = 10;
    }
    
    setPopupState({
      row,
      position: { x, y },
      type,
    });
  };

  const handleClosePopup = () => {
    setPopupState(null);
  };

  return (
    <>
      <section className="leaderboard-card">
        <div className="leaderboard-card__header">
          <div>
            <p className="eyebrow">Leaderboard</p>
            <h2>2025 All-Star Cup Standings</h2>
          </div>
          <Link href="#" className="link-button">
            Download Media Guide →
          </Link>
        </div>
        <div className="leaderboard-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Chg</th>
                <th>Team / Athlete</th>
                <th>Pos</th>
                <th>Total Pts</th>
                <th>Pts to Next</th>
                <th>Games</th>
                <th>Win</th>
                <th>Stat</th>
                <th>MVP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardRows.map((row) => (
                <tr key={row.rank}>
                  <td>{row.rank}</td>
                  <td>
                    <span className={`change change--${changeTone(row.change)}`}>
                      {row.change}
                    </span>
                  </td>
                  <td>
                    <div className="athlete-cell">
                      <Image
                        src={row.headshot}
                        alt={row.athlete}
                        width={48}
                        height={48}
                        unoptimized
                      />
                      <div>
                        <p>
                          {row.athlete} <span>{row.jersey}</span>
                        </p>
                        <p>{row.team}</p>
                      </div>
                    </div>
                  </td>
                  <td>{row.position}</td>
                  <td>{row.totalPts}</td>
                  <td>{row.delta}</td>
                  <td>{row.games}</td>
                  <td 
                    onClick={(e) => handlePointsClick(row, 'win', e)}
                    className="stat-points-cell"
                  >
                    <div className="cursor-pointer">{row.winPts}</div>
                  </td> 
                  <td 
                    onClick={(e) => handlePointsClick(row, 'stat', e)}
                    className="stat-points-cell"
                  >
                    <div className="cursor-pointer">{row.statPts}</div>
                  </td>
                  <td 
                    onClick={(e) => handlePointsClick(row, 'mvp', e)}
                    className="stat-points-cell"
                  >
                    <div className="cursor-pointer">{row.mvpPts}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-footnote">
          *The AUSL All-Star Cup was known as the Championship season through
          2024.
        </p>
      </section>
      {popupState && popupState.row && (
        <InfoPopup
          row={popupState.row}
          position={popupState.position}
          type={popupState.type}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}

function changeTone(value: string) {
  if (value.startsWith("+")) return "up";
  if (value.startsWith("–") || value === "–") return "steady";
  return "down";
}

function StatusGrid() {
  return (
    <section className="status-grid">
      {statusCallouts.map((card) => (
        <article key={card.title} className="status-card">
          <p className="eyebrow">{card.title}</p>
          <p>{card.body}</p>
        </article>
      ))}
    </section>
  );
}

function ProtectedPlayers() {
  return (
    <section className="protected-card">
      <div className="protected-card__header">
        <div>
          <p className="eyebrow">Protected Lists</p>
          <h2>Who&apos;s locked in for 2026?</h2>
        </div>
        <p className="stat-sub">
          Eight athletes revealed, twelve more coming as social shares climb.
        </p>
      </div>
      <div className="protected-card__grid">
        {protectedTeams.map((block) => (
          <div key={block.team} className="protected-block">
            <h3>{block.team}</h3>
            <ul>
              {block.players.map((player) => (
                <li key={player}>{player}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsMarquee() {
  return (
    <section className="news-marquee">
      <div className="news-marquee__track">
        {newsTicker.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="cta-card">
      <div>
        <p className="eyebrow">Stay Updated</p>
        <h2>Follow @theauslofficial</h2>
        <p>
          Be first in line for player signings, team trades, and allocation pool
          reveals ahead of the AUSL Draft on Dec 1.
        </p>
      </div>
      <button className="cta-button cta-button--ghost">
        Turn on notifications
      </button>
    </section>
  );
}

export default function Page() {
  const [leaderboardRows, setLeaderboardRows] = useState<LeaderboardRow[]>(fallbackLeaderboardRows);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchLeaderboard();
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
  );
}

