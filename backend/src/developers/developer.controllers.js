import Developer from "./developer.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST /api/developers/register
export const registerDeveloperController = async (request, response, next) => {
    try {
        const { username, email, password } = request.body;

        const developer = await Developer.create({ username, email, password });
        developer.password = undefined;
        const token = signToken(developer._id);

        response.status(201).json({
            success: true,
            message: "Developer registered successfully",
            token,
            data: developer
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

        const developer = await Developer.findOne({ email }).select('+password');

        if (!developer || !(await developer.comparePassword(password))) {
            return response.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = signToken(developer._id);
        developer.password = undefined;

        response.status(200).json({ success: true, token, data: developer });

    }
    catch (error) {
        return next(error);
    }
}

// POST /api/developers/logout
export const logoutDeveloperController = async (request, response, next) => {
    try {
        response.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    catch (error) {
        return next(error);
    }
}

// GET /api/developers/me
export const getMe = async (req, res, next) => {
    try {
        response.status(200).json({ success: true, data: request.developer });
    } catch (err) {
        return next(err);
    }
};


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d',
    });
};