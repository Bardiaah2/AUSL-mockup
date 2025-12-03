export type LeaderboardRow = {
  rank: number;  // athlete's rank; calculated on frontend
  change: string;  // rank change indicator, e.g., "+1", "–", "-2"; from player_info backend route
  athlete: string;  // athlete's name; from all the routes
  headshot: string;  // URL to athlete's headshot image; from player_info backend route
  bio_url: string;  // URL to athlete's bio page; from player_info backend route
  team: string;  // athlete's team; not currently provided by backend
  position: string;  // athlete's position; from player_info backend route
  totalPts: number;  // total points scored; from points backend route
  delta: string;  // points to next rank; from player_info backend route
  games: number;  // number of games played; from pitchingstats + hittingstats backend routes
  winPts: number;  // points from wins; from points backend route
  statPts: number;  // points from statistics; from points backend route
  mvpPts: number | string;  // points from MVP award; from points backend route
  _raw: {  // raw backend data for breakdown in infopopup
    // mvp breakdown
    MVP1Points: number;
    MVP2Points: number;
    MVP3Points: number;
    MVPDefensePoints: number;
    // win breakdown
    InningsWon: number;
    Wins: number;
    // stat breakdown
    singles: number;
    doubles: number;
    triples: number;
    homeRuns: number;
    stolenBases: number;
    caughtStealing: number;
    walks: number;
    hitByPitch: number;
    sacrifices: number;
    sacfly: number;
    sacbunt: number;
    outs: number;
    allowedRuns: number;
  }
};


