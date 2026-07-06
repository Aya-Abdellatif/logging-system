import { LEVEL_COLORS } from "../constants/logLevels";

export function Badge({ level }) {
  const c = LEVEL_COLORS[level] || {};
  return (
    <span style={{
      background: c.bg, color: c.text, fontSize: 11, fontWeight: 600,
      padding: "2px 8px", borderRadius: 6, letterSpacing: 0.5,
    }}>{level}</span>
  );
}
