import Link from "next/link";

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

export default Header;