import jwt from 'jsonwebtoken';
import Developer from '../developers/developer.model.js';

export const validateAuthToken = async (request, response, next) => {
    try {
        const { authorization } = request.headers;

        if (!authorization) {
            return response.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const authorizationHeaderValue = authorization.split(" ");

        if (authorizationHeaderValue.length !== 2 || authorizationHeaderValue[0] !== 'Bearer' || !authorizationHeaderValue[1]) {
            return response.status(401).json({ success: false, message: "Invalid token format" })
        }

        const token = authorizationHeaderValue[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const developer = await Developer.findById(decoded.id);

        if (!developer) {
            return response.status(401).json({ success: false, message: 'Developer no longer exists' });
        }

        request.developer = developer;
        next();
    } catch (err) {
        return response.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};