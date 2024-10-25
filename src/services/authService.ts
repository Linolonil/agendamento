import prisma from '../models/prismaClient';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { User } from './../types/user.types';
import * as argon2 from 'argon2';

export const loginService = async (userName: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { userName },
    });
  
    // Verifique se o usuário existe
    if (!user) {
      throw new Error('Credenciais inválidas');
    }
  
    // Verifique se a senha está correta
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }
  
    // Gera tokens
    const accessToken = generateAccessToken(user.id, user.userName, user.role);
    console.log(accessToken)
    const refreshToken = generateRefreshToken(user.id);
    return { user, accessToken, refreshToken };
  };

export const registerService = async ({ name, role, userName, password }: User) => {
    const checkUser = await prisma.user.findUnique({
        where: { userName }, // Verificando pelo userName
    });

    if (checkUser) {
        throw new Error("Usuário já existe");
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

    if (!user) {
        throw new Error("Erro ao criar usuário");
    }
    
    return user;
};