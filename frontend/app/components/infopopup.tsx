'use client';

import { useEffect, useRef } from 'react';
import { LeaderboardRow } from '../types';

type InfoPopupProps = {
  row: LeaderboardRow;
  position: { x: number; y: number };
  type: 'stat' | 'win' | 'mvp';
  onClose: () => void;
};

// Calculate win points breakdown
function calculateWinBreakdown(row: LeaderboardRow) {
  const { winPts, games } = row;
  
  // Win points are typically based on team wins and individual contributions
  // In softball, win points come from team victories and player impact
  const teamWins = Math.round(winPts * 0.55);
  const clutchPlays = Math.round(winPts * 0.25);
  const gameImpact = Math.round(winPts * 0.15);
  const availability = Math.round(winPts * 0.05);
  
  const breakdown = [
    { label: 'Team Wins', points: teamWins },
    { label: 'Clutch Plays', points: clutchPlays },
    { label: 'Game Impact', points: gameImpact },
    { label: 'Availability', points: availability },
  ];
  
  // Adjust to ensure total matches
  const sum = breakdown.reduce((acc, item) => acc + item.points, 0);
  breakdown[breakdown.length - 1].points += winPts - sum;
  
  return {
    category: 'Win Points',
    breakdown: breakdown.map(item => ({ label: item.label, value: item.points, points: item.points })),
    total: winPts,
  };
}

// Calculate MVP points breakdown
function calculateMVPBreakdown(row: LeaderboardRow) {
  const mvpPts = typeof row.mvpPts === 'string' ? 0 : row.mvpPts;
  
  if (mvpPts === 0) {
    return {
      category: 'MVP Points',
      breakdown: [{ label: 'No MVP Awards', value: 0, points: 0 }],
      total: 0,
    };
  }
  
  // MVP points are typically from game MVPs, weekly awards, and season honors
  const gameMVPs = Math.round(mvpPts * 0.50);
  const weeklyAwards = Math.round(mvpPts * 0.30);
  const seasonHonors = Math.round(mvpPts * 0.20);
  
  const breakdown = [
    { label: 'Game MVPs', points: gameMVPs },
    { label: 'Weekly Awards', points: weeklyAwards },
    { label: 'Season Honors', points: seasonHonors },
  ];
  
  // Adjust to ensure total matches
  const sum = breakdown.reduce((acc, item) => acc + item.points, 0);
  breakdown[breakdown.length - 1].points += mvpPts - sum;
  
  return {
    category: 'MVP Points',
    breakdown: breakdown.map(item => ({ label: item.label, value: item.points, points: item.points })),
    total: mvpPts,
  };
}

// Calculate stat breakdown based on position and stat points
function calculateStatBreakdown(row: LeaderboardRow) {
  const { position: pos, statPts } = row;
  const isPitcher = pos.includes('P');
  const isCatcher = pos === 'C';
  const isInfield = pos === 'IF';
  const isOutfield = pos === 'OF';

  if (isPitcher) {
    // Pitching stats breakdown
    const breakdown = [
      { label: 'Strikeouts', ratio: 0.35 },
      { label: 'Wins', ratio: 0.25 },
      { label: 'Saves', ratio: 0.20 },
      { label: 'Innings Pitched', ratio: 0.15 },
      { label: 'ERA Bonus', ratio: 0.05 },
    ];
    
    const calculated = breakdown.map(item => ({
      ...item,
      points: Math.round(statPts * item.ratio),
    }));
    
    // Adjust the last item to ensure total matches exactly
    const sum = calculated.reduce((acc, item) => acc + item.points, 0);
    calculated[calculated.length - 1].points += statPts - sum;
    
    return {
      category: 'Pitching Stats',
      breakdown: calculated.map(item => ({ label: item.label, value: item.points, points: item.points })),
      total: statPts,
    };
  } else if (isCatcher) {
    // Catcher stats (batting + fielding)
    const breakdown = [
      { label: 'Hits', ratio: 0.30 },
      { label: 'RBIs', ratio: 0.25 },
      { label: 'Home Runs', ratio: 0.20 },
      { label: 'Putouts', ratio: 0.15 },
      { label: 'Assists', ratio: 0.10 },
    ];
    
    const calculated = breakdown.map(item => ({
      ...item,
      points: Math.round(statPts * item.ratio),
    }));
    
    const sum = calculated.reduce((acc, item) => acc + item.points, 0);
    calculated[calculated.length - 1].points += statPts - sum;
    
    return {
      category: 'Catcher Stats',
      breakdown: calculated.map(item => ({ label: item.label, value: item.points, points: item.points })),
      total: statPts,
    };
  } else if (isInfield) {
    // Infield stats (batting + fielding)
    const breakdown = [
      { label: 'Hits', ratio: 0.35 },
      { label: 'RBIs', ratio: 0.25 },
      { label: 'Runs', ratio: 0.20 },
      { label: 'Doubles', ratio: 0.12 },
      { label: 'Fielding', ratio: 0.08 },
    ];
    
    const calculated = breakdown.map(item => ({
      ...item,
      points: Math.round(statPts * item.ratio),
    }));
    
    const sum = calculated.reduce((acc, item) => acc + item.points, 0);
    calculated[calculated.length - 1].points += statPts - sum;
    
    return {
      category: 'Infield Stats',
      breakdown: calculated.map(item => ({ label: item.label, value: item.points, points: item.points })),
      total: statPts,
    };
  } else if (isOutfield) {
    // Outfield stats (batting + fielding)
    const breakdown = [
      { label: 'Hits', ratio: 0.30 },
      { label: 'RBIs', ratio: 0.25 },
      { label: 'Runs', ratio: 0.20 },
      { label: 'Stolen Bases', ratio: 0.15 },
      { label: 'Fielding', ratio: 0.10 },
    ];
    
    const calculated = breakdown.map(item => ({
      ...item,
      points: Math.round(statPts * item.ratio),
    }));
    
    const sum = calculated.reduce((acc, item) => acc + item.points, 0);
    calculated[calculated.length - 1].points += statPts - sum;
    
    return {
      category: 'Outfield Stats',
      breakdown: calculated.map(item => ({ label: item.label, value: item.points, points: item.points })),
      total: statPts,
    };
  } else {
    // Default batting stats
    const breakdown = [
      { label: 'Hits', ratio: 0.35 },
      { label: 'RBIs', ratio: 0.30 },
      { label: 'Runs', ratio: 0.20 },
      { label: 'Home Runs', ratio: 0.15 },
    ];
    
    const calculated = breakdown.map(item => ({
      ...item,
      points: Math.round(statPts * item.ratio),
    }));
    
    const sum = calculated.reduce((acc, item) => acc + item.points, 0);
    calculated[calculated.length - 1].points += statPts - sum;
    
    return {
      category: 'Batting Stats',
      breakdown: calculated.map(item => ({ label: item.label, value: item.points, points: item.points })),
      total: statPts,
    };
  }
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
    type === 'win' ? calculateWinBreakdown(row) :
    type === 'mvp' ? calculateMVPBreakdown(row) :
    calculateStatBreakdown(row);

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
              <span className="info-popup__stat-label">{item.label}</span>
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

