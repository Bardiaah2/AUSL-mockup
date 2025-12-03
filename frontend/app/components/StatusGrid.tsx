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

export default StatusGrid;