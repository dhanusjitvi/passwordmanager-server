import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const verifyUserToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded) {
            req.user = decoded;
            next();
        }
    }
    catch (error) {
        next(error);
    }
};
export default verifyUserToken;
