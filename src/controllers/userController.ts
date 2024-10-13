import { FastifyReply, FastifyRequest } from 'fastify';
import * as userService from '../services/userService';
import { User } from '@prisma/client';


export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { name, role, password, userName , iconProfile} = request.body as User;

        if (!name || !role || !password || !userName) {
            return reply.code(400).send({ error: "Todos as informações são obrigatórias" });
        }

        const user = await userService.createUser({name, role, password, userName, iconProfile} as User);

        reply.code(201).send(user);
    } catch (error) {
        reply.code(400).send({ error: (error as Error).message });
    }
};

export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await userService.getAllUsers();
    reply.send(user);
};

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as {id:string}

    if(!id){
        throw new Error("ID não informado")
    }

    const user = await userService.getUserById({ id });

    reply.send(user);
};

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as {id:string};
    const {name, userName, password, iconProfile, role} = request.body as User;

    if(!id){
        throw new Error("Id não informado");
    }

    if(!name && !password && !userName && !role){
        throw new Error("Todas as propiedades estão indefinidas ou estão vazias");
    }

    const user = await userService.updateUser({id, name, userName, password, role, iconProfile } as User & {id:string});

    reply.code(200).send(user);
};

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as {id:string};

    if(!id){
        throw new Error("Id não informado");
    }
    
    const user = await userService.deleteUser({ id }); 

    reply.code(200).send({user});
};

