export function VerticalBarChart({ items, colorVar = 'var(--ke-green)' }) {
  const maxValue = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className="vbar-chart" role="list">
      {items.map((item) => {
        const pct = (item.value / maxValue) * 100;
        return (
          <div
            className="vbar-col"
            role="listitem"
            tabIndex={0}
            key={item.label}
            aria-label={`${item.label}: ${item.value}`}
          >
            <div className="vbar-track">
              <div className="vbar-fill" style={{ height: `${pct}%`, background: colorVar }}>
                <span className="vbar-value">{item.value}</span>
              </div>
            </div>
            <span className="vbar-label" title={item.label}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
