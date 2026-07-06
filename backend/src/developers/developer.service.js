import Developer from './developer.model.js';

export const createDeveloper = ({ username, email, password }) => {
    return Developer.create({ username, email, password });
};

export const findDeveloperByEmailWithPassword = (email) => {
    return Developer.findOne({ email }).select('+password');
};
