const SEGMENTS = [
  { key: 'low', label: 'Low', color: '#0ca30c' },
  { key: 'medium', label: 'Medium', color: '#fab219' },
  { key: 'high', label: 'High', color: '#d03b3b' },
];

const R = 60;
const CX = 70;
const CY = 70;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function PieChart({ data }) {
  const total = (data.low || 0) + (data.medium || 0) + (data.high || 0);

  if (total === 0) {
    return <p className="empty-state">No submissions yet.</p>;
  }

  let cursor = 0;
  const slices = SEGMENTS.map((seg) => {
    const value = data[seg.key] || 0;
    const pct = value / total;
    const startAngle = cursor * 360;
    cursor += pct;
    const endAngle = cursor * 360;
    return { ...seg, value, pct, startAngle, endAngle };
  }).filter((s) => s.value > 0);

  return (
    <div className="pie-wrap">
      <svg viewBox="0 0 140 140" className="pie-chart" role="img" aria-label="Submissions by urgency level">
        {slices.map((s) => {
          const mid = (s.startAngle + s.endAngle) / 2;
          const labelPos = polarToCartesian(CX, CY, R * 0.62, mid);
          const showLabel = s.pct >= 0.08;
          return (
            <g key={s.key}>
              <path
                d={arcPath(CX, CY, R, s.startAngle, s.endAngle)}
                fill={s.color}
                stroke="var(--surface)"
                strokeWidth="2"
                strokeLinejoin="round"
                tabIndex={0}
                className="pie-slice"
                aria-label={`${s.label}: ${s.value} (${Math.round(s.pct * 100)}%)`}
              />
              {showLabel && (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pie-slice-label"
                >
                  {Math.round(s.pct * 100)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="urgency-legend">
        {SEGMENTS.map((seg) => (
          <span className="urgency-legend-item" key={seg.key}>
            <span className="urgency-dot" style={{ background: seg.color }} />
            {seg.label}
            <span className="urgency-legend-count">{data[seg.key] || 0}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
