export function PieChart({ stats, total }) {
  const pct = (v) => total > 0 ? Math.round(v / total * 100) : 0;
  const radius = 70, cx = 90, cy = 90;
  const colors = { INFO: "#378add", WARN: "#ef9f27", ERROR: "#e24b4a" };
  let start = -Math.PI / 2;
  const slices = Object.entries(stats).map(([k, v]) => {
    const angle = total > 0 ? (v / total) * 2 * Math.PI : 0;
    const end = start + angle;
    const x1 = cx + radius * Math.cos(start), y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end), y2 = cy + radius * Math.sin(end);
    const large = angle > Math.PI ? 1 : 0;
    const d = angle > 0.01 ? `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${large} 1 ${x2},${y2} Z` : "";
    const mid = start + angle / 2;
    const lx = cx + (radius * 0.65) * Math.cos(mid), ly = cy + (radius * 0.65) * Math.sin(mid);
    start = end;
    return { key: k, color: colors[k], d, lx, ly, pct: pct(v), val: v };
  });

  return (
    <svg viewBox="0 0 180 180" width={180} height={180}>
      {slices.map(s => s.d && (
        <path key={s.key} d={s.d} fill={s.color} opacity={0.85} />
      ))}
      {slices.map(s => s.pct > 5 && (
        <text key={s.key} x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle"
          fill="#fff" fontSize={11} fontWeight={700}>{s.pct}%</text>
      ))}
    </svg>
  );
}
