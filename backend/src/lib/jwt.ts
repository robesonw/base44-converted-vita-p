import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signAccessToken = (payload: Object) => {
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
    });
};

export const signRefreshToken = (payload: Object) => {
    return jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: config.refreshExpiresIn
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, config.jwtSecret);
};