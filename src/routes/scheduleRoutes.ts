import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as scheduleController from '../controllers/scheduleController'

export async function scheduleRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/api/v1/schedule/create', scheduleController.createSchedule);
    fastify.put('/api/v1/schedule/confirmSchedule/:id', scheduleController.confirmSchedule); 
    fastify.get('/api/v1/schedule/getAllSchedules/:date', scheduleController.getAllSchedules);
    fastify.get('/api/v1/schedule/getSchedule/:id', scheduleController.getScheduleById); 
    fastify.delete('/api/v1/schedule/deleteSchedule/:id', scheduleController.deleteScheduleById);
    fastify.put('/api/v1/schedule/updateSchedule/:id', scheduleController.updateScheduleById);
};
