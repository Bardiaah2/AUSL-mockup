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

export default ProtectedPlayers;