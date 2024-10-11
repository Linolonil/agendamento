import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as lawyerController from '../controllers/lawyerController';

export async function lawyerRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/lawyers', lawyerController.createLawyer);
    fastify.get('/lawyers', lawyerController.getLawyers);
};
