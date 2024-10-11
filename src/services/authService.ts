import prisma from '../models/prismaClient';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { User } from './../types/user.types';
import * as argon2 from 'argon2'



export const loginService = async (userName: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { userName },
    });
    if (!user) {
        throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
    }
    const accessToken = generateAccessToken(user.id, user.userName, user.role);
    const refreshToken = generateRefreshToken(user.id);
    return { user, accessToken, refreshToken };
};

export const registerService = async ({name, role, userName, password} : User) => {

    const checkUser = await prisma.user.findMany({
        where: {
            name: {
                contains: name, 
                mode: 'insensitive', 
            },
        },
    });

    if(checkUser.length > 0) {
        throw new Error("Usuário já criado");
    }

    const hash = await argon2.hash(password);

    const user = await prisma.user.create({
        data: {
            name,
            role,
            password: hash,
            userName,
            iconProfile: "./img/user.png",
        },
    });

    if(!user) {
        throw new Error("Erro ao criar usuário");
    }
    
    return user
};

