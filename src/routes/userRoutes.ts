import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as userController from '../controllers/userController'
import authMiddleware from '../middlewares/authMiddleware';

export async function userRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.addHook('preHandler', authMiddleware);
    fastify.post('/api/v1/user/create', userController.createUser);
    fastify.get('/api/v1/user/getAllUsers', userController.getAllUsers);
    fastify.get('/api/v1/user/getUser/:id', userController.getUser);
    fastify.put('/api/v1/user/updateUser/:id', userController.updateUser);
    fastify.delete('/api/v1/user/deleteUser/:id', userController.deleteUser);

};
