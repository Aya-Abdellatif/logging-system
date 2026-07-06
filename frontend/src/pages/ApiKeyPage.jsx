import { useState } from "react";
import { Btn } from "../components/Btn";

export function ApiKeyPage({ developer, revealedApiKey, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");

  const maskedKey = developer?.apiKeyPrefix ? `${developer.apiKeyPrefix}.${"•".repeat(24)}` : "••••••••";
  const displayKey = revealedApiKey || maskedKey;

  const copy = () => {
    navigator.clipboard.writeText(displayKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerate = async () => {
    if (!confirm("Regenerating will immediately invalidate your current API key. Continue?")) return;
    setError(""); setRegenerating(true);
    try {
      await onRegenerate();
    } catch (e) { setError(e.message); }
    setRegenerating(false);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, color: "#0f172a", marginBottom: 6 }}>Your API Key</h2>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
        Use this key to authenticate your SDK when sending logs.
      </p>

      {revealedApiKey && (
        <div style={{
          background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e",
          borderRadius: 10, padding: "12px 16px", fontSize: 13, marginBottom: 16,
        }}>
          Copy this key now — for your security we only show the full key once and can't display it again.
        </div>
      )}

      <div style={{
        background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12,
        padding: 20, display: "flex", alignItems: "center", gap: 12,
      }}>
        <code style={{ flex: 1, fontSize: 13, color: "#0f172a", wordBreak: "break-all", fontFamily: "monospace" }}>
          {displayKey}
        </code>
        <Btn variant="ghost" onClick={copy} style={{ flexShrink: 0 }}>
          {copied ? "✓ Copied" : "Copy"}
        </Btn>
      </div>

      {error && <div style={{ marginTop: 12, color: "#b91c1c", fontSize: 13 }}>{error}</div>}

      <div style={{ marginTop: 16 }}>
        <Btn variant="outline" loading={regenerating} onClick={regenerate}>Regenerate Key</Btn>
      </div>

      <div style={{
        marginTop: 24, background: "#eff6ff", border: "1px solid #bfdbfe",
        borderRadius: 10, padding: 16,
      }}>
        <div style={{ fontWeight: 600, color: "#1e40af", fontSize: 13, marginBottom: 6 }}>SDK Usage</div>
        <pre style={{ margin: 0, fontSize: 12, color: "#1e3a8a", lineHeight: 1.7 }}>{`const logger = require('logflow-sdk');

logger.init({
  apiKey: '${displayKey}',
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
