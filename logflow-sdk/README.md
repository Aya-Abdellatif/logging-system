# logflow-sdk

Official Node.js SDK for the [LogFlow](https://github.com/your-repo) logging system.

Send structured logs from your application to your LogFlow dashboard in one line of code.

---

## Installation

```bash
npm install logflow-sdk
```

---

## Quick Start

```js
const logflow = require('logflow-sdk');

// 1. Initialize once at app startup
logflow.init({
  apiKey: 'your-api-key',      // from your LogFlow account page
  appName: 'my-app',           // must already exist on LogFlow
  baseUrl: 'https://your-logflow-server.com',
});

// 2. Send logs anywhere in your app
await logflow.log({ message: 'Server started', level: 'INFO' });
```

---

## API Reference

### `logflow.init(options)`

Initializes the SDK. **Must be called once** before any `log()` calls.

| Option    | Type     | Required | Description                              |
|-----------|----------|----------|------------------------------------------|
| `apiKey`  | `string` | ✅       | Your developer API key from LogFlow.     |
| `appName` | `string` | ✅       | Your application's unique name.          |
| `baseUrl` | `string` | ❌       | LogFlow server URL (default: `http://localhost:5000`). |

---

### `logflow.log({ message, level })`

Sends a log entry to your application.

| Option    | Type     | Required | Default  | Description                        |
|-----------|----------|----------|----------|------------------------------------|
| `message` | `string` | ✅       | —        | The log message to record.         |
| `level`   | `string` | ❌       | `"INFO"` | One of: `INFO`, `WARN`, `ERROR`.   |

Returns a `Promise` that resolves with the saved log object.

---

## Log Levels

| Level   | When to use                          |
|---------|--------------------------------------|
| `INFO`  | General events (user login, startup) |
| `WARN`  | Minor issues that need attention     |
| `ERROR` | Critical bugs or failures            |

---

## Notes

- If the same message is logged more than once, LogFlow increments its **count** rather than creating duplicates.
- Only the owner of both the API key and the application can post logs.

---

## License

MIT