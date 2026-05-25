import jwt from 'jsonwebtoken';
import Developer from '../developers/developer.model.js';

export const validateAuthToken = async (request, response, next) => {
    try {
        let token;

        if (request.cookies?.jwt) {
            token = request.cookies.jwt;
        }
        else if (request.headers.authorization) {

            const authorizationHeaderValue = request.headers.authorization.split(" ");

            if (authorizationHeaderValue.length !== 2 || authorizationHeaderValue[0] !== 'Bearer' || !authorizationHeaderValue[1]) {
                return response.status(401).json({ success: false, message: "Invalid token format" })
            }

            token = authorizationHeaderValue[1];
        }

        if (!token) {
            return response.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const developer = await Developer.findById(decoded.id);

        if (!developer) {
            return response.status(401).json({ success: false, message: 'Developer no longer exists' });
        }

        request.developer = developer;
        return next();

    } catch (err) {
        return response.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};