import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as authController from '../controllers/authController';

export async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/api/v1/auth/login', authController.loginUser);
    fastify.get('/api/v1/auth/verify', authController.verifyToken);
    fastify.post('/api/v1/auth/register', authController.registerUser);
    fastify.post('/api/v1/auth/refresh-token', authController.refreshToken);
};
