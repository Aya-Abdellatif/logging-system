import crypto from 'crypto';

const PREFIX_BYTES = 6;
const SECRET_BYTES = 32;

const hashApiKey = (fullKey) => {
    return crypto
        .createHmac('sha256', process.env.API_KEY_HASH_SECRET)
        .update(fullKey)
        .digest('hex');
};

export const generateApiKey = () => {
    const prefix = `lf_${crypto.randomBytes(PREFIX_BYTES).toString('hex')}`;
    const secret = crypto.randomBytes(SECRET_BYTES).toString('hex');
    const fullKey = `${prefix}.${secret}`;

    return { fullKey, prefix, hash: hashApiKey(fullKey) };
};

export const verifyApiKey = (candidateKey, storedHash) => {
    if (!storedHash) return false;

    const candidateHash = Buffer.from(hashApiKey(candidateKey), 'hex');
    const knownHash = Buffer.from(storedHash, 'hex');

    if (candidateHash.length !== knownHash.length) return false;

    return crypto.timingSafeEqual(candidateHash, knownHash);
};
