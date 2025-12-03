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

export default FilterPanel;