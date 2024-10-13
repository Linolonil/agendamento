import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as lawyerController from '../controllers/lawyerController';

export async function lawyerRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/api/v1/lawyer/create', lawyerController.createLawyer);
    fastify.get('/api/v1/lawyer/getAll', lawyerController.getLawyers);
    fastify.get('/api/v1/lawyer/getLawyerByOab', lawyerController.getLawyersByOab);
    fastify.put('/api/v1/lawyer/update/:id', lawyerController.updateLawyer);
    fastify.delete('/api/v1/lawyer/delete/:id', lawyerController.deleteLawyer);
};
