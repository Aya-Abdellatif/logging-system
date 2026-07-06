import axios from "axios";

let _config = {
    apiKey: null,
    appName: null,
    baseUrl: null,
    batchSize: 20,
    flushIntervalMs: 2000,
};

const VALID_LEVELS = ['INFO', 'WARN', 'ERROR'];

let _queue = [];
let _flushTimer = null;

function init({ apiKey, appName, baseUrl = "http://localhost:5000", batchSize = 20, flushIntervalMs = 2000 }) {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
        throw new Error('[LogFlow] init() requires a non-empty "apiKey" string.');
    }

    if (!appName || typeof appName !== 'string' || appName.trim() === '') {
        throw new Error('[LogFlow] init() requires a non-empty "appName" string.');
    }

    if (appName.includes(' ')) {
        throw new Error('[LogFlow] "appName" must not contain whitespace.');
    }

    _config = {
        apiKey: apiKey.trim(),
        appName: appName.trim(),
        baseUrl: baseUrl.replace(/\/$/, ''),
        batchSize,
        flushIntervalMs,
    };
}

function log({ message, level = 'INFO' }) {
    if (!_config.apiKey || !_config.appName) {
        throw new Error(
            '[LogFlow] SDK not initialized. Call logflow.init({ apiKey, appName }) first.'
        );
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
        throw new Error('[LogFlow] log() requires a non-empty "message" string.');
    }

    const normalizedLevel = level.toUpperCase();
    if (!VALID_LEVELS.includes(normalizedLevel)) {
        throw new Error(
            `[LogFlow] Invalid log level "${level}". Must be one of: ${VALID_LEVELS.join(', ')}.`
        );
    }

    _queue.push({ message: message.trim(), level: normalizedLevel });

    if (_queue.length >= _config.batchSize) {
        flush();
    } else if (!_flushTimer) {
        _flushTimer = setTimeout(flush, _config.flushIntervalMs);
    }
}

// Sends whatever is currently queued right now, without waiting for the
// batch size or flush interval to be reached. Fire-and-forget log() calls
// don't wait on this, but short-lived scripts should await it before
// exiting so queued logs aren't lost.
async function flush() {
    if (_flushTimer) {
        clearTimeout(_flushTimer);
        _flushTimer = null;
    }

    if (_queue.length === 0) return;

    const batch = _queue;
    _queue = [];

    try {
        await axios.post(
            `${_config.baseUrl}/api/applications/${_config.appName}/logs/batch`,
            { logs: batch },
            {
                headers: {
                    'x-api-key': _config.apiKey,
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        const reason = error.response
            ? `API error (${error.response.status}): ${error.response.data?.message || JSON.stringify(error.response.data)}`
            : `Network error: ${error.message}`;
        console.error(`[LogFlow] Failed to send ${batch.length} log(s): ${reason}`);
    }
}

// Best-effort: catches the common case of a process exiting naturally
// with logs still queued. Doesn't fire on process.exit() or signals -
// call flush() explicitly before those in short-lived scripts.
process.once('beforeExit', () => { flush(); });

export default {
    init,
    log,
    flush,
};
