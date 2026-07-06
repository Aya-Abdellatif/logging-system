import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api/client";
import { Btn } from "../components/Btn";
import { Spinner } from "../components/Spinner";
import { Badge } from "../components/Badge";
import { LEVEL_COLORS } from "../constants/logLevels";
import { PieChart } from "./LogsPage.PieChart";

export function LogsPage({ appName, onBack }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("recent");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("table");
  const [stats, setStats] = useState({ INFO: 0, WARN: 0, ERROR: 0 });
  const [newMessage, setNewMessage] = useState("");
  const [newLevel, setNewLevel] = useState("INFO");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

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

  const createLog = async () => {
    if (!newMessage.trim()) {
      setCreateError("Please enter a log message.");
      return;
    }

    setCreateError("");
    setCreateLoading(true);
    try {
      await apiFetch(`/applications/${appName}/logs`, {
        method: "POST",
        body: JSON.stringify({ message: newMessage.trim(), level: newLevel }),
      });
      setNewMessage("");
      setNewLevel("INFO");
      await load();
    } catch (e) {
      setCreateError(e.message);
    }
    setCreateLoading(false);
  };

  const total = stats.INFO + stats.WARN + stats.ERROR;
  const pct = (v) => total > 0 ? Math.round(v / total * 100) : 0;

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

      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Send a log without SDK</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>Add a message and level, then send directly to this application.</div>
          </div>
          <select value={newLevel} onChange={e => setNewLevel(e.target.value)}
            style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>

        <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your log message here..."
          rows={3}
          style={{ width: "100%", marginTop: 14, padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, resize: "vertical" }} />

        {createError && (
          <div style={{ marginTop: 12, color: "#b91c1c", fontSize: 13 }}>{createError}</div>
        )}

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <Btn loading={createLoading} onClick={createLog} style={{ padding: "10px 18px", fontSize: 13 }}>Send Log</Btn>
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
              <PieChart stats={stats} total={total} />
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
