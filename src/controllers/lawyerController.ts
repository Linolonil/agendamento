import { FastifyReply, FastifyRequest } from 'fastify';
import * as lawyerService from '../services/lawyerService';
import { Lawyer } from '@prisma/client';


export const createLawyer = async (request: FastifyRequest, reply: FastifyReply) => {
    const {name, role, oab, phoneNumber, icon} = request.body as Lawyer;
    const lawyer = await lawyerService.createLawyer({name, role, oab, phoneNumber, icon} as Lawyer);

    reply.code(201).send(lawyer);
};

export const getLawyers = async (request: FastifyRequest, reply: FastifyReply) => {
    const lawyers = await lawyerService.getLawyers();
    reply.send(lawyers);
};

