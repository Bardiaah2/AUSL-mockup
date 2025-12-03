'use client';

import { useEffect, useRef } from 'react';
import { LeaderboardRow } from '../types';

type InfoPopupProps = {
  row: LeaderboardRow;
  position: { x: number; y: number };
  type: 'stat' | 'win' | 'mvp';
  onClose: () => void;
};

// Point values from breakdownInfo.md
const STAT_POINTS = {
  single: 10,
  double: 20,
  triple: 30,
  homeRun: 40,
  stolenBase: 10,
  caughtStealing: -10,
  walk: 10,
  hitByPitch: 8,
  sacrifice: 10,
};

const PITCHING_POINTS = {
  out: 4,
  allowedRun: -10,
};

const WIN_MULTIPLIERS = {
  inningsWon: 10,
  gamesWon: 70,
};

// Calculate win points breakdown from raw data
function calculateWinBreakdown(row: LeaderboardRow) {
  const raw = row._raw;
  if (!raw) {
    return {
      category: 'Win Points',
      breakdown: [{ label: 'No data', value: 0, points: 0, weight: '' }],
      total: row.winPts,
    };
  }

  const inningsWonPoints = raw.InningsWon * WIN_MULTIPLIERS.inningsWon;
  const gamesWonPoints = raw.Wins * WIN_MULTIPLIERS.gamesWon;

  const breakdown = [
    { label: 'Innings Won', count: raw.InningsWon, weight: WIN_MULTIPLIERS.inningsWon, points: inningsWonPoints },
    { label: 'Games Won', count: raw.Wins, weight: WIN_MULTIPLIERS.gamesWon, points: gamesWonPoints },
  ];

  return {
    category: 'Win Points',
    breakdown: breakdown.map((item) => ({ label: item.label, value: item.points, points: item.points, weight: `${item.count} × ${item.weight}` })),
    total: row.winPts,
  };
}

// Calculate MVP points breakdown from raw data
function calculateMVPBreakdown(row: LeaderboardRow) {
  const mvpPts = typeof row.mvpPts === 'string' ? 0 : row.mvpPts;
  const raw = row._raw;

  if (!raw || mvpPts === 0) {
    return {
      category: 'MVP Points',
      breakdown: [{ label: 'No MVP Awards', value: 0, points: 0, weight: '' }],
      total: mvpPts,
    };
  }

  const breakdown = [
    { label: '1st Place MVPs', count: raw.MVP1Points, points: raw.MVP1Points },
    { label: '2nd Place MVPs', count: raw.MVP2Points, points: raw.MVP2Points },
    { label: '3rd Place MVPs', count: raw.MVP3Points, points: raw.MVP3Points },
    { label: 'Defense MVPs', count: raw.MVPDefensePoints, points: raw.MVPDefensePoints },
  ].filter((item) => item.count > 0);

  return {
    category: 'MVP Points',
    breakdown: breakdown.map((item) => ({ label: item.label, value: item.points, points: item.points, weight: `${item.count}×` })),
    total: mvpPts,
  };
}

// Calculate stat breakdown based on raw hitting and pitching data
function calculateStatBreakdown(row: LeaderboardRow) {
  const raw = row._raw;
  if (!raw) {
    return {
      category: 'Stat Points',
      breakdown: [{ label: 'No data', value: 0, points: 0, weight: '' }],
      total: row.statPts,
    };
  }

  const breakdown = [];

  // Hitting stats
  if (raw.singles > 0) {
    breakdown.push({ label: 'Singles', count: raw.singles, weight: STAT_POINTS.single, points: raw.singles * STAT_POINTS.single });
  }
  if (raw.doubles > 0) {
    breakdown.push({ label: 'Doubles', count: raw.doubles, weight: STAT_POINTS.double, points: raw.doubles * STAT_POINTS.double });
  }
  if (raw.triples > 0) {
    breakdown.push({ label: 'Triples', count: raw.triples, weight: STAT_POINTS.triple, points: raw.triples * STAT_POINTS.triple });
  }
  if (raw.homeRuns > 0) {
    breakdown.push({ label: 'Home Runs', count: raw.homeRuns, weight: STAT_POINTS.homeRun, points: raw.homeRuns * STAT_POINTS.homeRun });
  }
  if (raw.stolenBases > 0) {
    breakdown.push({ label: 'Stolen Bases', count: raw.stolenBases, weight: STAT_POINTS.stolenBase, points: raw.stolenBases * STAT_POINTS.stolenBase });
  }
  if (raw.caughtStealing !== 0) {
    breakdown.push({ label: 'Caught Stealing', count: raw.caughtStealing, weight: STAT_POINTS.caughtStealing, points: raw.caughtStealing * STAT_POINTS.caughtStealing });
  }
  if (raw.walks > 0) {
    breakdown.push({ label: 'Walks', count: raw.walks, weight: STAT_POINTS.walk, points: raw.walks * STAT_POINTS.walk });
  }
  if (raw.hitByPitch > 0) {
    breakdown.push({ label: 'Hit By Pitch', count: raw.hitByPitch, weight: STAT_POINTS.hitByPitch, points: raw.hitByPitch * STAT_POINTS.hitByPitch });
  }
  if (raw.sacrifices > 0) {
    breakdown.push({ label: 'Sacrifices', count: raw.sacrifices, weight: STAT_POINTS.sacrifice, points: raw.sacrifices * STAT_POINTS.sacrifice });
  }

  // Pitching stats
  if (raw.outs > 0) {
    breakdown.push({ label: 'Outs Recorded', count: raw.outs, weight: PITCHING_POINTS.out, points: raw.outs * PITCHING_POINTS.out });
  }
  if (raw.allowedRuns !== 0) {
    breakdown.push({ label: 'Runs Allowed', count: raw.allowedRuns, weight: PITCHING_POINTS.allowedRun, points: raw.allowedRuns * PITCHING_POINTS.allowedRun });
  }

  // If no stats found, show a message
  if (breakdown.length === 0) {
    breakdown.push({ label: 'No statistics recorded', count: 0, weight: 0, points: 0 });
  }

  return {
    category: 'Stat Points',
    breakdown: breakdown.map((item) => ({ label: item.label, value: item.points, points: item.points, weight: `${item.count} × ${item.weight}` })),
    total: row.statPts,
  };
}

export default function InfoPopup({ row, position, type, onClose }: InfoPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const breakdown =
    type === 'win'
      ? calculateWinBreakdown(row)
      : type === 'mvp'
        ? calculateMVPBreakdown(row)
        : calculateStatBreakdown(row);

  return (
    <div
      ref={popupRef}
      className="info-popup"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseLeave={onClose}
    >
      <div className="info-popup__header">
        <div>
          <p className="info-popup__athlete">{row.athlete}</p>
          <p className="info-popup__position">{row.position} • {row.team}</p>
        </div>
        <button className="info-popup__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <div className="info-popup__content">
        <p className="info-popup__category">{breakdown.category}</p>
        <div className="info-popup__breakdown">
          {breakdown.breakdown.map((item, index) => (
            <div key={index} className="info-popup__stat-row">
              <div className="info-popup__stat-label-group">
                <span className="info-popup__stat-label">{item.label}</span>
                <span className="info-popup__stat-weight">{item.weight}</span>
              </div>
              <span className="info-popup__stat-value">{item.points} pts</span>
            </div>
          ))}
        </div>
        <div className="info-popup__total">
          <span>Total {breakdown.category}</span>
          <span>{breakdown.total}</span>
        </div>
      </div>
    </div>
  );
}

