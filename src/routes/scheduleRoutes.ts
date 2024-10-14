import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as scheduleController from '../controllers/scheduleController'

export async function scheduleRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/api/v1/schedule/create', scheduleController.createSchedule);
    fastify.get('/api/v1/schedule/getAllSchedules', scheduleController.getAllSchedules);
    // fastify.get('/api/v1/user/getUser/:id', userController.getUser);
    // fastify.put('/api/v1/user/updateUser/:id', userController.updateUser);
    // fastify.delete('/api/v1/user/deleteUser/:id', userController.deleteUser);

};
