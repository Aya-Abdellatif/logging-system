import axios from "axios";

let _config = {
    apiKey: null,
    appName: null,
    baseUrl: null,
    batchSize: 20,
    flushIntervalMs: 2000,
    maxRetries: 3,
};

const VALID_LEVELS = ['INFO', 'WARN', 'ERROR'];
const RETRY_BASE_DELAY_MS = 1000;

let _queue = [];
let _flushTimer = null;

function init({ apiKey, appName, baseUrl = "http://localhost:5000", batchSize = 20, flushIntervalMs = 2000, maxRetries = 3 }) {
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
        maxRetries,
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

// A missing response means the request never reached the server (network
// down, timeout, DNS failure) - worth retrying. A 5xx means the server is
// having a transient problem - also worth retrying. A 4xx (bad API key,
// malformed data) means the request itself is wrong - retrying it
// unchanged will just fail the same way every time.
function isRetryable(error) {
    return !error.response || error.response.status >= 500;
}

function describeError(error) {
    return error.response
        ? `API error (${error.response.status}): ${error.response.data?.message || JSON.stringify(error.response.data)}`
        : `Network error: ${error.message}`;
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Sends one batch, retrying transient failures with exponential backoff
// (1s, 2s, 4s, ... up to maxRetries). Runs independently of the live
// queue/timer, so new log() calls keep batching and flushing on their own
// schedule while this retries in the background.
async function sendBatch(batch, attempt = 0) {
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
        if (attempt < _config.maxRetries && isRetryable(error)) {
            await wait(RETRY_BASE_DELAY_MS * 2 ** attempt);
            return sendBatch(batch, attempt + 1);
        }

        console.error(`[LogFlow] Failed to send ${batch.length} log(s) after ${attempt + 1} attempt(s): ${describeError(error)}`);
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

    await sendBatch(batch);
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
