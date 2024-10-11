import { FastifyReply, FastifyRequest } from 'fastify';
import * as authService from '../services/authService';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../utils/jwt';

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { userName, password, checkPassword } = request.body as { userName: string, password: string, checkPassword: string };
    if(checkPassword !== password) {
        return reply.status(401).send({ message: "As senhas são diferentes" });
    }

    try {
        const { user, accessToken, refreshToken } = await authService.loginService(userName, password);

        reply.status(200).send({ user, accessToken, refreshToken });
    } catch (error) {
        if ((error as Error).message === 'Credenciais inválidas') {
            return reply.status(401).send({ message: (error as Error).message });
        }
        reply.status(500).send({ message: 'Erro interno do servidor' });
    }
};

export const refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = request.body as { refreshToken: string };

    if (!refreshToken) {
        return reply.status(401).send('Refresh Token Required');
    }

    try {
        const userData = jwt.verify(refreshToken , process.env.JWT_SECRET as string) as {userId: string, userName: string, role: string};
        
        const accessToken = generateAccessToken(userData.userId, userData.userName, userData.role) ;
        return reply.send({ accessToken });
    } catch (error) {
        return reply.status(403).send('Invalid Refresh Token');
    }
};

export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, role, userName, password } = request.body as User;

    if(!name || !role || !userName || !password) {
        return reply.status(400).send({ message: "Campos obrigatórios não informados" });
    }

    try {
        const user = await authService.registerService({ name, role, userName, password } as User);
        reply.code(201).send(user);
    } catch (error) {
        reply.code(400).send({ message: (error as Error).message }); 
    }
};


