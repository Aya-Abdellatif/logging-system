import Developer from './developer.model.js';
import { generateApiKey } from '../utils/apiKey.util.js';

export const createDeveloper = async ({ username, email, password }) => {
    const { fullKey, prefix, hash } = generateApiKey();

    const developer = await Developer.create({
        username,
        email,
        password,
        apiKeyPrefix: prefix,
        apiKeyHash: hash,
    });

    return { developer, apiKey: fullKey };
};

export const findDeveloperByEmailWithPassword = (email) => {
    return Developer.findOne({ email }).select('+password');
};

export const regenerateApiKey = async (developerId) => {
    const { fullKey, prefix, hash } = generateApiKey();

    const developer = await Developer.findByIdAndUpdate(
        developerId,
        { apiKeyPrefix: prefix, apiKeyHash: hash },
        { new: true }
    );

    return { developer, apiKey: fullKey };
};
