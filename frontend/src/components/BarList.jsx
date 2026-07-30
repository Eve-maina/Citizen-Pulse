export function BarList({ items, colorVar = 'var(--ke-green)', formatValue = (v) => v }) {
  const maxValue = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className="barlist" role="list">
      {items.map((item) => {
        const pct = (item.value / maxValue) * 100;
        return (
          <div
            className="barlist-row"
            role="listitem"
            tabIndex={0}
            key={item.label}
            aria-label={`${item.label}: ${formatValue(item.value)}`}
          >
            <span className="barlist-label" title={item.label}>
              {item.label}
            </span>
            <div className="barlist-track">
              <div
                className="barlist-fill"
                style={{ width: `${pct}%`, background: colorVar }}
              />
            </div>
            <span className="barlist-value">{formatValue(item.value)}</span>
          </div>
        );
      })}
    </div>
  );
}
