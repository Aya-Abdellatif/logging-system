import * as logService from './log.service.js';
import { verifyApiKey } from '../utils/apiKey.util.js';

// Resolves which application a log-write request is authorized against.
// Either a logged-in dashboard session (owns the app) or a valid x-api-key
// for external SDK calls. Returns { application } or { error: { status, message } }.
const resolveApplicationForLogWrite = async (request) => {
  if (request.developer) {
    const application = await logService.findApplicationForDeveloper(request.params.name, request.developer._id);

    if (!application) {
      return { error: { status: 404, message: 'Application not found' } };
    }

    return { application };
  }

  const apiKey = request.headers['x-api-key'];
  if (!apiKey) {
    return { error: { status: 401, message: 'API key is required' } };
  }

  const application = await logService.findApplicationWithDeveloper(request.params.name);

  if (!application) {
    return { error: { status: 404, message: 'Application not found' } };
  }

  if (!verifyApiKey(apiKey, application.developer.apiKeyHash)) {
    return { error: { status: 403, message: 'Invalid API key for this application' } };
  }

  return { application };
};

// GET /api/applications/:name/logs
export const getLogs = async (request, response, next) => {
  try {
    const application = await logService.findApplicationForDeveloper(request.params.name, request.developer._id);

    if (!application) {
      return response.status(404).json({ success: false, message: 'Application not found' });
    }

    const { logs, total, page, totalPages } = await logService.queryLogs(application._id, request.query);

    response.status(200).json({
      success: true,
      total,
      page,
      totalPages,
      data: logs,
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/applications/:name/logs
export const postLog = async (request, response, next) => {
  try {
    const { message, level } = request.body;

    const { application, error } = await resolveApplicationForLogWrite(request);
    if (error) {
      return response.status(error.status).json({ success: false, message: error.message });
    }

    const log = await logService.upsertLog(application._id, message, level);

    response.status(201).json({ success: true, data: log });
  } catch (err) {
    return next(err);
  }
};

// POST /api/applications/:name/logs/batch
export const postLogsBatch = async (request, response, next) => {
  try {
    const { logs } = request.body;

    if (!Array.isArray(logs) || logs.length === 0) {
      return response.status(400).json({ success: false, message: '"logs" must be a non-empty array' });
    }

    const { application, error } = await resolveApplicationForLogWrite(request);
    if (error) {
      return response.status(error.status).json({ success: false, message: error.message });
    }

    const savedLogs = await logService.upsertLogsBatch(application._id, logs);

    response.status(201).json({ success: true, data: savedLogs });
  } catch (err) {
    return next(err);
  }
};

// GET /api/applications/:name/logs/stats
export const getLogStats = async (request, response, next) => {
  try {
    const application = await logService.findApplicationForDeveloper(request.params.name, request.developer._id);

    if (!application) {
      return response.status(404).json({ success: false, message: 'Application not found' });
    }

    const stats = await logService.getLogStats(application._id);

    response.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
