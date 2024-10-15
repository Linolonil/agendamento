import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as roomController from '../controllers/roomController'
import authMiddleware from '../middlewares/authMiddleware';

export async function roomRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.addHook('preHandler', authMiddleware);
    fastify.post('/api/v1/room/create', roomController.createRoom);
    fastify.get('/api/v1/room/getAllRoom', roomController.getAllRoom);
    fastify.get('/api/v1/room/getRoom/:number', roomController.getRoom);
    fastify.put('/api/v1/room/updateRoom/:id', roomController.updateRoom);
    fastify.delete('/api/v1/room/deleteRoom/:id', roomController.deleteRoom);

};
