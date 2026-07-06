
import logflow from './index.js';

// ─── 1. Initialize once at app startup ───────────────────────────────────────
logflow.init({
  apiKey: 'YOUR_API_KEY_HERE',       // from your LogFlow account
  appName: 'my-test-app',            // must already exist on LogFlow
  baseUrl: 'http://localhost:5000',  // your LogFlow server
});

// ─── 2. Send logs anywhere in your app ───────────────────────────────────────
// log() queues the entry and returns immediately - it doesn't wait on the
// network. Queued logs are sent together in a batch, either once enough
// pile up (batchSize) or after a short delay (flushIntervalMs).
logflow.log({ message: 'Application started', level: 'INFO' });
logflow.log({ message: 'Cache warmed', level: 'INFO' });
logflow.log({ message: 'Rate limit hit', level: 'WARN' });

// Short-lived scripts should flush explicitly before exiting, so queued
// logs aren't lost.
await logflow.flush();
console.log('Logs flushed');