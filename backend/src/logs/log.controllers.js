import Log from './log.model.js';
import Application from '../applications/application.model.js';

// GET /api/applications/:name/logs
export const getLogs = async (request, response, next) => {
  try {
    const application = await Application.findOne({
      name: request.params.name,
      developer: request.developer._id,
    });

    if (!application) {
      return response.status(404).json({ success: false, message: 'Application not found' });
    }

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      level,
      search,
    } = request.query;

    const filter = { application: application._id };

    if (level) {
      const levels = level.toUpperCase().split(',');
      filter.level = { $in: levels };
    }

    if (search) {
      filter.message = { $regex: search, $options: 'i' };
    }

    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      Log.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Log.countDocuments(filter),
    ]);

    response.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
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

    const application = await Application.findOne({
      name: request.params.name,
    }).populate('developer');

    if (!application) {
      return response.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.developer.apiKey !== apiKey) {
      return response.status(403).json({ success: false, message: 'Invalid API key for this application' });
    }

    const log = await Log.findOneAndUpdate(
      { application: application._id, message, level: level.toUpperCase() },
      { $inc: { count: 1 } },
      { new: true, upsert: true, runValidators: true }
    );

    response.status(201).json({ success: true, data: log });
  } catch (error) {
    return next(error);
  }
};

// GET /api/applications/:name/logs/stats
export const getLogStats = async (request, response, next) => {
  try {
    const application = await Application.findOne({
      name: request.params.name,
      developer: request.developer._id,
    });

    if (!application) {
      return response.status(404).json({ success: false, message: 'Application not found' });
    }

    const levelDistribution = await Log.aggregate([
      { $match: { application: application._id } },
      { $group: { _id: '$level', count: { $sum: '$count' } } },
      { $project: { level: '$_id', count: 1, _id: 0 } },
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyBreakdown = await Log.aggregate([
      { $match: { application: application._id, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            level: '$level',
          },
          count: { $sum: '$count' },
        },
      },
      { $sort: { '_id.date': 1 } },
      { $project: { date: '$_id.date', level: '$_id.level', count: 1, _id: 0 } },
    ]);

    response.status(200).json({ success: true, data: { levelDistribution, dailyBreakdown } });
  } catch (err) {
    next(err);
  }
};