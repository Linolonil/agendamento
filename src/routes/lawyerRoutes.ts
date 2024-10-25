import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as lawyerController from '../controllers/lawyerController';
import authMiddleware from '../middlewares/authMiddleware';

export async function lawyerRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.addHook('preHandler', authMiddleware);
    fastify.post('/api/v1/lawyer/create', lawyerController.createLawyer);
    fastify.get('/api/v1/lawyer/getAll', lawyerController.getLawyers);
    fastify.get('/api/v1/lawyer/getLawyerByOab/:oab', lawyerController.getLawyersByOab);
    fastify.put('/api/v1/lawyer/update/:id', lawyerController.updateLawyer);
    fastify.delete('/api/v1/lawyer/delete/:id', lawyerController.deleteLawyer);
};
