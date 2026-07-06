import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api/client";
import { Btn } from "../components/Btn";
import { Spinner } from "../components/Spinner";

export function AppsPage({ onSelectApp }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/applications");
      setApps(data.data || []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!newName.trim()) return;
    setCreating(true); setError("");
    try {
      await apiFetch("/applications", { method: "POST", body: JSON.stringify({ name: newName.trim() }) });
      setNewName(""); await load();
    } catch (e) { setError(e.message); }
    setCreating(false);
  };

  const del = async (name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await apiFetch(`/applications/${name}`, { method: "DELETE" });
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 22, color: "#0f172a", margin: 0 }}>Applications</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0" }}>{apps.length} app{apps.length !== 1 ? "s" : ""} connected</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input value={newName} onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && create()}
          placeholder="new-app-name (no spaces)"
          style={{
            flex: 1, padding: "10px 14px", border: "1.5px solid #e2e8f0",
            borderRadius: 8, fontSize: 14, outline: "none",
          }} />
        <Btn loading={creating} onClick={create}>+ Create App</Btn>
      </div>

      {error && <div style={{ color: "#b91c1c", background: "#fee2e2", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          {apps.map(app => (
            <div key={app.name || app._id} style={{
              background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14,
              padding: 20, cursor: "pointer", transition: "all 0.15s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#93c5fd"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              onClick={() => onSelectApp(app.name)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{
                  width: 40, height: 40, background: "#eff6ff", borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12,
                }}>📦</div>
                <button onClick={e => { e.stopPropagation(); del(app.name); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", fontSize: 16, padding: 4 }}
                  title="Delete">✕</button>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>{app.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                Created {new Date(app.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          {apps.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: "#94a3b8" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
              No applications yet. Create your first one above!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
