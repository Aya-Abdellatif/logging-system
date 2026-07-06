import { Btn } from "../components/Btn";

export function Sidebar({ developer, onLogout, selected, onSelect }) {
  const navItems = [
    { id: "apps", icon: "▦", label: "Applications" },
    { id: "apikey", icon: "⚿", label: "API Key" },
  ];

  return (
    <div style={{
      width: 220, minHeight: "100vh", background: "#0f172a", display: "flex",
      flexDirection: "column", padding: "24px 0", flexShrink: 0,
    }}>
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, background: "#378add", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>📋</div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>LogFlow</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {navItems.map(item => (
          <div key={item.id} onClick={() => onSelect(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderRadius: 8, cursor: "pointer", marginBottom: 4,
              background: selected === item.id ? "#1e3a5f" : "transparent",
              color: selected === item.id ? "#93c5fd" : "#94a3b8",
              transition: "all 0.15s", fontSize: 14, fontWeight: selected === item.id ? 600 : 400,
            }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: "1px solid #1e293b" }}>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Signed in as</div>
        <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
          {developer?.username || developer?.email}
        </div>
        <Btn variant="ghost" onClick={onLogout} style={{ width: "100%", justifyContent: "center", fontSize: 12, color: "#94a3b8", borderColor: "#334155" }}>
          Logout
        </Btn>
      </div>
    </div>
  );
}
