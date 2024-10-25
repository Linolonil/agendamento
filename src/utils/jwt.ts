import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string, userName: string, role: string) => {
    const payload = { id: userId, username: userName, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '8h' });
   return token  
};

export const generateRefreshToken = (userId: string) => {
    const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' }); 
};
