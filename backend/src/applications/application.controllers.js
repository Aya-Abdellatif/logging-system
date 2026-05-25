import Application from './application.model.js';

// GET /api/applications
export const getAllApplications = async (request, response, next) => {
    try {
        const applications = await Application.find({ developer: request.developer._id });

        response.status(200).json({ success: true, data: applications });
    } catch (error) {
        return next(err);
    }
};

// POST /api/applications
export const createApplication = async (request, response, next) => {
    try {
        const { name } = request.body;

        const application = await Application.create({
            name,
            developer: request.developer._id,
        });

        response.status(201).json({ success: true, data: application });
    } catch (errpr) {
        return next(error);
    }
};

// DELETE /api/applications/:name
export const deleteApplication = async (request, response, next) => {
    try {
        const application = await Application.findOneAndDelete({
            name: request.params.name,
            developer: request.developer._id,
        });

        if (!application) {
            return response.status(404).json({ success: false, message: 'Application not found' });
        }

        response.status(200).json({ success: true, message: `Application "${application.name}" deleted successfully` });
    } catch (error) {
        return next(error);
    }
};