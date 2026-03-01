import jwt from 'jsonwebtoken';
import { config } from '../config';

export function signAccessToken(payload: object) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function signRefreshToken(payload: object) {
    return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.refreshExpiresIn });
}

export function verifyToken(token: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
}