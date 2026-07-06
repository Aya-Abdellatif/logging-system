import Log from './log.model.js';
import Application from '../applications/application.model.js';

export const findApplicationForDeveloper = (name, developerId) => {
    return Application.findOne({ name, developer: developerId });
};

export const findApplicationWithDeveloper = (name) => {
    return Application.findOne({ name }).populate({ path: 'developer', select: '+apiKeyHash' });
};

export const queryLogs = async (applicationId, { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', level, search }) => {
    const filter = { application: applicationId };

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

    return { logs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
};

export const upsertLog = (applicationId, message, level) => {
    return Log.findOneAndUpdate(
        { application: applicationId, message, level: level.toUpperCase() },
        { $inc: { count: 1 } },
        { new: true, upsert: true, runValidators: true }
    );
};

export const getLogStats = async (applicationId) => {
    const levelDistribution = await Log.aggregate([
        { $match: { application: applicationId } },
        { $group: { _id: '$level', count: { $sum: '$count' } } },
        { $project: { level: '$_id', count: 1, _id: 0 } },
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyBreakdown = await Log.aggregate([
        { $match: { application: applicationId, createdAt: { $gte: thirtyDaysAgo } } },
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

    return { levelDistribution, dailyBreakdown };
};
