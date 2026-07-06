import Application from './application.model.js';

export const getApplicationsByDeveloper = (developerId) => {
    return Application.find({ developer: developerId });
};

export const createApplication = (name, developerId) => {
    return Application.create({ name, developer: developerId });
};

export const deleteApplication = (name, developerId) => {
    return Application.findOneAndDelete({ name, developer: developerId });
};
