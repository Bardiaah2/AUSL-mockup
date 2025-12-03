'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import InfoPopup from "./infopopup";
import { LeaderboardRow } from "../types";

function changeTone(value: string) {
  if (value === "–") return "steady";
  const num = parseInt(value, 10);
  if (!isNaN(num)) {
    if (num > 0) return "up";
    if (num < 0) return "down";
    return "steady";
  }
  if (value.startsWith("+")) return "up";
  if (value.startsWith("-")) return "down";
  return "steady";
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
                      {row.headshot ? (
                        <Image
                          src={row.headshot}
                          alt={row.athlete}
                          width={48}
                          height={48}
                          unoptimized
                        />
                      ) : (
                        <div className="athlete-cell__placeholder" style={{ width: 48, height: 48, backgroundColor: '#e5e7eb', borderRadius: '0.5rem' }} />
                      )}
                      <div>
                        <p>
                          {row.bio_url ? (
                            <a href={row.bio_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
                              {row.athlete}
                            </a>
                          ) : (
                            row.athlete
                          )}
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

export default LeaderboardTable;