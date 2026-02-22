import jwt from 'jsonwebtoken';

export const signAccessToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export const signRefreshToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.REFRESH_EXPIRES_IN });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
};