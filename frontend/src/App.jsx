import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:5000/api";


async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: opts.body || undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

const LEVEL_COLORS = {
  INFO: { bg: "#e6f1fb", text: "#0c447c", dot: "#378add" },
  WARN: { bg: "#faeeda", text: "#854f0b", dot: "#ef9f27" },
  ERROR: { bg: "#fcebeb", text: "#a32d2d", dot: "#e24b4a" },
};

function Badge({ level }) {
  const c = LEVEL_COLORS[level] || {};
  return (
    <span style={{
      background: c.bg, color: c.text, fontSize: 11, fontWeight: 600,
      padding: "2px 8px", borderRadius: 6, letterSpacing: 0.5,
    }}>{level}</span>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <div style={{
        width: 28, height: 28, border: "2.5px solid #e2e8f0",
        borderTop: "2.5px solid #378add", borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Input({ label, ...props }) {
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

function Btn({ children, variant = "primary", loading, ...props }) {
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

// ─── AUTH PAGE ───────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const endpoint = mode === "login" ? "/developers/login" : "/developers/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : form;
      const data = await apiFetch(endpoint, { method: "POST", body: JSON.stringify(body) });
      onLogin(data.data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0369a1 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "44px 40px",
        width: 380, boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, background: "#1e3a5f", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 10h16M4 14h10M4 18h7" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", letterSpacing: -0.5 }}>LogFlow</span>
          </div>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
            {mode === "login" ? "Sign in to your dashboard" : "Create your developer account"}
          </p>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {mode === "register" && (
          <Input label="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="devname" />
        )}
        <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        <Input label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />

        <Btn loading={loading} onClick={submit} style={{ width: "100%", justifyContent: "center", padding: 12, fontSize: 14, marginTop: 4 }}>
          {mode === "login" ? "Sign In" : "Create Account"}
        </Btn>

        <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 20 }}>
          {mode === "login" ? "No account?" : "Already have one?"}{" "}
          <span style={{ color: "#0369a1", cursor: "pointer", fontWeight: 600 }}
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ developer, onLogout, selected, onSelect }) {
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

// ─── API KEY PAGE ─────────────────────────────────────────────────────────────
function ApiKeyPage({ developer }) {
  const [copied, setCopied] = useState(false);
  const key = developer?.apiKey || "••••••••-••••-••••-••••-••••••••••••";

  const copy = () => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, color: "#0f172a", marginBottom: 6 }}>Your API Key</h2>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
        Use this key to authenticate your SDK when sending logs.
      </p>
      <div style={{
        background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12,
        padding: 20, display: "flex", alignItems: "center", gap: 12,
      }}>
        <code style={{ flex: 1, fontSize: 13, color: "#0f172a", wordBreak: "break-all", fontFamily: "monospace" }}>
          {key}
        </code>
        <Btn variant="ghost" onClick={copy} style={{ flexShrink: 0 }}>
          {copied ? "✓ Copied" : "Copy"}
        </Btn>
      </div>
      <div style={{
        marginTop: 24, background: "#eff6ff", border: "1px solid #bfdbfe",
        borderRadius: 10, padding: 16,
      }}>
        <div style={{ fontWeight: 600, color: "#1e40af", fontSize: 13, marginBottom: 6 }}>SDK Usage</div>
        <pre style={{ margin: 0, fontSize: 12, color: "#1e3a8a", lineHeight: 1.7 }}>{`const logger = require('logflow-sdk');

logger.init({
  apiKey: '${key}',
  app: 'your-app-name',
  baseUrl: 'http://localhost:5000',
});

logger.log('User signed up', 'INFO');
logger.log('Rate limit hit', 'WARN');
logger.log('DB connection failed', 'ERROR');`}</pre>
      </div>
    </div>
  );
}

// ─── APPS LIST ────────────────────────────────────────────────────────────────
function AppsPage({ onSelectApp }) {
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

// ─── LOGS PAGE ────────────────────────────────────────────────────────────────
function LogsPage({ appName, onBack }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("recent");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("table");
  const [stats, setStats] = useState({ INFO: 0, WARN: 0, ERROR: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        sortBy: sort === "recent" ? "createdAt" : "count",
        order: "desc",
        ...(level ? { level } : {}),
        ...(search ? { search } : {}),
      });

      const [logsData, statsData] = await Promise.all([
        apiFetch(`/applications/${appName}/logs?${params}`),
        apiFetch(`/applications/${appName}/logs/stats`),
      ]);

      setLogs(logsData.data || []);
      setTotalPages(logsData.totalPages || 1);

      const s = { INFO: 0, WARN: 0, ERROR: 0 };
      (statsData.data?.levelDistribution || []).forEach(item => {
        if (s[item.level] !== undefined) s[item.level] = item.count;
      });
      setStats(s);

    } catch (e) { console.error(e); }
    setLoading(false);
  }, [appName, page, sort, level, search]);


  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [sort, level, search]);

  const total = stats.INFO + stats.WARN + stats.ERROR;
  const pct = (v) => total > 0 ? Math.round(v / total * 100) : 0;

  const PieChart = () => {
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
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={onBack} style={{
          background: "none", border: "1px solid #e2e8f0", borderRadius: 8,
          padding: "7px 12px", cursor: "pointer", fontSize: 13, color: "#64748b",
        }}>← Back</button>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 22, color: "#0f172a", margin: 0 }}>{appName}</h2>
          <p style={{ color: "#64748b", fontSize: 13, margin: "2px 0 0" }}>Application logs</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {Object.entries(stats).map(([k, v]) => {
          const c = LEVEL_COLORS[k];
          return (
            <div key={k} style={{
              background: c.bg, borderRadius: 12, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.text }}>{v}</div>
                <div style={{ fontSize: 12, color: c.text, opacity: 0.7, fontWeight: 500 }}>{k}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#f1f5f9", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {["table", "charts"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t ? "#fff" : "transparent",
            color: tab === t ? "#0f172a" : "#64748b",
            boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s",
          }}>
            {t === "table" ? "📋 Logs Table" : "📊 Charts"}
          </button>
        ))}
      </div>

      {tab === "charts" && (
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 24, flex: "0 0 auto" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", marginBottom: 16 }}>Log Level Distribution</div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <PieChart />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Object.entries(stats).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: LEVEL_COLORS[k].dot }} />
                    <span style={{ fontSize: 13, color: "#64748b", minWidth: 40 }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{v}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>({pct(v)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "table" && (
        <>
          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search messages..."
              style={{
                flex: 1, minWidth: 180, padding: "9px 14px", border: "1.5px solid #e2e8f0",
                borderRadius: 8, fontSize: 13, outline: "none",
              }} />
            <select value={level} onChange={e => setLevel(e.target.value)}
              style={{ padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", cursor: "pointer" }}>
              <option value="">All Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", cursor: "pointer" }}>
              <option value="recent">Most Recent</option>
              <option value="count">Most Occurred</option>
            </select>
          </div>

          {loading ? <Spinner /> : (
            <>
              <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Message", "Level", "Count", "First Seen", "Last Seen"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12, borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={log._id || i} style={{ borderBottom: "1px solid #f1f5f9" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px 16px", color: "#0f172a", maxWidth: 280, wordBreak: "break-word" }}>{log.message}</td>
                        <td style={{ padding: "12px 16px" }}><Badge level={log.level} /></td>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0f172a" }}>{log.count}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{new Date(log.createdAt).toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{new Date(log.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No logs found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{
                      width: 34, height: 34, borderRadius: 8, border: "1.5px solid",
                      borderColor: p === page ? "#378add" : "#e2e8f0",
                      background: p === page ? "#eff6ff" : "#fff",
                      color: p === page ? "#1d4ed8" : "#64748b",
                      fontWeight: p === page ? 700 : 400, cursor: "pointer", fontSize: 13,
                    }}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [developer, setDeveloper] = useState(null);
  const [page, setPage] = useState("apps");
  const [selectedApp, setSelectedApp] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    apiFetch("/developers/me")
      .then(data => { setDeveloper(data.data); setBooting(false); })
      .catch(() => setBooting(false));
  }, []);

  const logout = async () => {
    try { await apiFetch("/developers/logout", { method: "POST" }); } catch { }
    setDeveloper(null); setSelectedApp(null);
  };

  if (booting) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spinner />
    </div>
  );

  if (!developer) return <AuthPage onLogin={setDeveloper} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui,sans-serif" }}>
      <Sidebar developer={developer} onLogout={logout} selected={selectedApp ? "apps" : page} onSelect={(p) => { setPage(p); setSelectedApp(null); }} />
      <main style={{ flex: 1, padding: 36, overflowY: "auto" }}>
        {selectedApp ? (
          <LogsPage appName={selectedApp} onBack={() => setSelectedApp(null)} />
        ) : page === "apps" ? (
          <AppsPage onSelectApp={name => setSelectedApp(name)} />
        ) : (
          <ApiKeyPage developer={developer} />
        )}
      </main>
    </div>
  );
}
