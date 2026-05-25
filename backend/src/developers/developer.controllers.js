import User from "./users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST /api/developers/register
export const registerDeveloperController = async (request, response, next) => {
    try {

    }
    catch (error) {
        return next(error);
    }
}

// POST /api/developers/login
export const loginDeveloperController = async (request, response, next) => {
    try {

    }
    catch (error) {
        return next(error);
    }
}

// POST /api/developers/logout
export const logoutDeveloperController = async (request, response, next) => {
    try {

    }
    catch (error) {
        return next(error);
    }
}

// GET /api/developers/me
export const getMe = async (req, res, next) => {
    try {
        
    } catch (err) {
        next(err);
    }
};