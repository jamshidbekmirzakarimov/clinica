import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

export const generateTokens = (userId: number, email: string) => {
    const accessToken = jwt.sign({ id: userId, email }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: userId, email }, REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET);
};
