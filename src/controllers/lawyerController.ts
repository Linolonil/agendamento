import { FastifyReply, FastifyRequest } from 'fastify';
import * as lawyerService from '../services/lawyerService';
import { Lawyer } from '@prisma/client';


export const createLawyer = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { name, oab, phoneNumber } = request.body as Lawyer;

        if (!name || !oab) {
            return reply.code(400).send({ error: "Nome e OAB são obrigatórios" });
        }

        const lawyer = await lawyerService.createLawyer({ name, oab, phoneNumber } as Lawyer);

        reply.code(201).send(lawyer);
    } catch (error) {
        reply.code(400).send({ error: (error as Error).message });
    }
};

export const getLawyers = async (request: FastifyRequest, reply: FastifyReply) => {
    const lawyers = await lawyerService.getLawyers();
    reply.send(lawyers);
};

export const getLawyersByOab = async (request: FastifyRequest, reply: FastifyReply) => {
    const { oab } = request.params as {oab:string}

    const lawyers = await lawyerService.getLawyersByOab({ oab });
    reply.send(lawyers);
};

export const updateLawyer = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as {id:string};
    const {name, phoneNumber, oab} = request.body as Lawyer;

    if(!id){
        throw new Error("Id não informado");
    }
    if(!name && !phoneNumber && !oab){
        throw new Error("Todas as propiedades estão indefinidas ou estão vazias");
    }

    const lawyers = await lawyerService.updateLawyers({id, name, phoneNumber, oab} as Lawyer & {id:string});

    reply.code(200).send(lawyers);
};

export const deleteLawyer = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as {id:string};

    if(!id){
        throw new Error("Id não informado");
    }
    
    const lawyers = await lawyerService.deleteLawyers({ id }); 

    reply.code(200).send({lawyers});
};

