
import logflow from './index.js';

// ─── 1. Initialize once at app startup ───────────────────────────────────────
logflow.init({
  apiKey: 'YOUR_API_KEY_HERE',       // from your LogFlow account
  appName: 'my-app',            // must already exist on LogFlow
  baseUrl: 'http://localhost:5000',  // your LogFlow server
});

// ─── 2. Send logs anywhere in your app ───────────────────────────────────────
async function main() {
  try {
    // Using the generic log() method
    await logflow.log({ message: 'Application started', level: 'INFO' });
    console.log('INFO log sent');

  } catch (err) {
    console.error(err.message);
  }
}

main();