import * as logService from './log.service.js';

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

    const apiKey = request.headers['x-api-key'];
    if (!apiKey) {
      return response.status(401).json({ success: false, message: 'API key is required' });
    }

    const application = await logService.findApplicationWithDeveloper(request.params.name);

    if (!application) {
      return response.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.developer.apiKey !== apiKey) {
      return response.status(403).json({ success: false, message: 'Invalid API key for this application' });
    }

    const log = await logService.upsertLog(application._id, message, level);

    response.status(201).json({ success: true, data: log });
  } catch (error) {
    return next(error);
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
