import { useState } from "react";
import { apiFetch } from "../api/client";
import { Input } from "../components/Input";
import { Btn } from "../components/Btn";

export function AuthPage({ onLogin }) {
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
      onLogin(data.data, data.apiKey);
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
