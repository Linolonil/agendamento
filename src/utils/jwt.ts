import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string, userName: string, role: string) => {
    const payload = { id: userId, username: userName, role };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '15m' }); 
};

export const generateRefreshToken = (userId: string) => {
    const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' }); 
};
