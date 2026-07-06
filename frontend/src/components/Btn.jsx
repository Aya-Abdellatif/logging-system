export function Btn({ children, variant = "primary", loading, ...props }) {
  const styles = {
    primary: { background: "#1e3a5f", color: "#fff", border: "none" },
    outline: { background: "#fff", color: "#1e3a5f", border: "1.5px solid #1e3a5f" },
    danger: { background: "#fee2e2", color: "#b91c1c", border: "none" },
    ghost: { background: "transparent", color: "#64748b", border: "1px solid #e2e8f0" },
  };
  return (
    <button {...props} style={{
      padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
      transition: "opacity 0.15s, transform 0.1s", opacity: loading ? 0.6 : 1,
      ...styles[variant], ...props.style,
    }}>
      {loading ? "..." : children}
    </button>
  );
}
