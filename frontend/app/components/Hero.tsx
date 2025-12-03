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

export default Hero;