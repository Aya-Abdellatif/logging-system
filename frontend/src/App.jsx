import { useState, useEffect } from "react";
import { apiFetch } from "./api/client";
import { Spinner } from "./components/Spinner";
import { AuthPage } from "./pages/AuthPage";
import { Sidebar } from "./pages/Sidebar";
import { ApiKeyPage } from "./pages/ApiKeyPage";
import { AppsPage } from "./pages/AppsPage";
import { LogsPage } from "./pages/LogsPage";

export default function App() {
  const [developer, setDeveloper] = useState(null);
  const [revealedApiKey, setRevealedApiKey] = useState(null);
  const [page, setPage] = useState("apps");
  const [selectedApp, setSelectedApp] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    apiFetch("/developers/me")
      .then(data => { setDeveloper(data.data); setBooting(false); })
      .catch(() => setBooting(false));
  }, []);

  const handleLogin = (dev, apiKey) => {
    setDeveloper(dev);
    if (apiKey) setRevealedApiKey(apiKey);
  };

  const navigate = (p) => {
    if (page === "apikey" && p !== "apikey") setRevealedApiKey(null);
    setPage(p);
    setSelectedApp(null);
  };

  const regenerateApiKey = async () => {
    const data = await apiFetch("/developers/regenerate-key", { method: "POST" });
    setDeveloper(data.data);
    setRevealedApiKey(data.apiKey);
  };

  const logout = async () => {
    try { await apiFetch("/developers/logout", { method: "POST" }); } catch { }
    setDeveloper(null); setSelectedApp(null); setRevealedApiKey(null);
  };

  if (booting) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spinner />
    </div>
  );

  if (!developer) return <AuthPage onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui,sans-serif" }}>
      <Sidebar developer={developer} onLogout={logout} selected={selectedApp ? "apps" : page} onSelect={navigate} />
      <main style={{ flex: 1, padding: 36, overflowY: "auto" }}>
        {selectedApp ? (
          <LogsPage appName={selectedApp} onBack={() => setSelectedApp(null)} />
        ) : page === "apps" ? (
          <AppsPage onSelectApp={name => setSelectedApp(name)} />
        ) : (
          <ApiKeyPage developer={developer} revealedApiKey={revealedApiKey} onRegenerate={regenerateApiKey} />
        )}
      </main>
    </div>
  );
}
