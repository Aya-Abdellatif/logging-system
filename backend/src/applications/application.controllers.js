import * as applicationService from './application.service.js';

// GET /api/applications
export const getAllApplications = async (request, response, next) => {
    try {
        const applications = await applicationService.getApplicationsByDeveloper(request.developer._id);

        response.status(200).json({ success: true, data: applications });
    } catch (error) {
        return next(error);
    }
};

// POST /api/applications
export const createApplication = async (request, response, next) => {
    try {
        const { name } = request.body;

        const application = await applicationService.createApplication(name, request.developer._id);

        response.status(201).json({ success: true, data: application });
    } catch (error) {
        return next(error);
    }
};

// DELETE /api/applications/:name
export const deleteApplication = async (request, response, next) => {
    try {
        const application = await applicationService.deleteApplication(request.params.name, request.developer._id);

        if (!application) {
            return response.status(404).json({ success: false, message: 'Application not found' });
        }

        response.status(200).json({ success: true, message: `Application "${application.name}" deleted successfully` });
    } catch (error) {
        return next(error);
    }
};
