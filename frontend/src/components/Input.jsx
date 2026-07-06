export function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>{label}</label>}
      <input {...props} style={{
        width: "100%", boxSizing: "border-box", padding: "10px 12px",
        border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14,
        outline: "none", transition: "border 0.2s",
        background: "#fff", color: "#0f172a",
        ...props.style,
      }}
        onFocus={e => e.target.style.border = "1px solid #378add"}
        onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
      />
    </div>
  );
}
