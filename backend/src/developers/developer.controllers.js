import * as developerService from "./developer.service.js"
import { signToken, sendTokenAsCookie, clearTokenCookie } from "../utils/token.util.js";

// POST /api/developers/register
export const registerDeveloperController = async (request, response, next) => {
    try {
        const { username, email, password } = request.body;

        const { developer, apiKey } = await developerService.createDeveloper({ username, email, password });
        developer.password = undefined;
        developer.apiKeyHash = undefined;
        const token = signToken(developer._id);

        sendTokenAsCookie(response, token);

        response.status(201).json({
            success: true,
            message: "Developer registered successfully",
            token,
            data: developer,
            apiKey,
        });
    }
    catch (error) {
        return next(error);
    }
}

// POST /api/developers/login
export const loginDeveloperController = async (request, response, next) => {
    try {
        const { email, password } = request.body;

        const developer = await developerService.findDeveloperByEmailWithPassword(email);

        if (!developer || !(await developer.comparePassword(password))) {
            return response.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = signToken(developer._id);
        developer.password = undefined;

        sendTokenAsCookie(response, token);

        response.status(200).json({ success: true, token, data: developer });

    }
    catch (error) {
        return next(error);
    }
}

// POST /api/developers/logout
export const logoutDeveloperController = async (request, response, next) => {
    try {
        clearTokenCookie(response);
        response.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    catch (error) {
        return next(error);
    }
}

// GET /api/developers/me
export const getMe = async (request, response, next) => {
    try {
        response.status(200).json({ success: true, data: request.developer });
    } catch (err) {
        return next(err);
    }
};

// POST /api/developers/regenerate-key
export const regenerateApiKeyController = async (request, response, next) => {
    try {
        const { developer, apiKey } = await developerService.regenerateApiKey(request.developer._id);
        response.status(200).json({ success: true, data: developer, apiKey });
    } catch (error) {
        return next(error);
    }
};
