import axios from "axios";

let _config = {
    apiKey: null,
    appName: null,
    baseUrl: null,
};

const VALID_LEVELS = ['INFO', 'WARN', 'ERROR'];


function init({ apiKey, appName, baseUrl = "http://localhost:5000" }) {
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
        baseUrl: baseUrl.replace(/\/$/, '')
    }
}

async function log({ message, level = 'INFO' }) {


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

    try {
        const response = await axios.post(
            `${_config.baseUrl}/api/applications/${_config.appName}/logs`,
            {
                message: message.trim(),
                level: normalizedLevel,
            },
            {
                headers: {
                    'x-api-key': _config.apiKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            throw new Error(
                `[LogFlow] API error (${status}): ${data?.message || JSON.stringify(data)}`
            );
        }

        throw new Error(`[LogFlow] Network error: ${error.message}`);
    }
}

export default {
    init,
    log,
};