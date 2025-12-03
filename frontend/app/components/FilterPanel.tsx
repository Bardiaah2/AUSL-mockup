const filters = {
  series: [
    "2025 All-Star Cup",
  ],
    scope: [],
};

function FilterPanel() {
  return (
    <section className="filter-panel flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-6">
      <div className="filter-panel__tabs center">
        <button className="filter-tab filter-tab--active">Overview</button>
      </div>
      <div className="filter-panel__filters flex items-center justify-center gap-4">
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