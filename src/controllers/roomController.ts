import { FastifyReply, FastifyRequest } from "fastify";
import { Room} from "@prisma/client";
import * as roomService from './../services/roomService';

export const createRoom = async (request: FastifyRequest, reply: FastifyReply) => {
    const { number,isAvailable, hasAirConditioning, hasComputer, hasTV, capacity } = request.body as Room;

    if(!number && !isAvailable && !hasAirConditioning && !hasComputer && !hasTV && !capacity){
        throw new Error("Todos os campos precisam ser preenchidos!")
    }

    const room = await roomService.createRoom({number, isAvailable, hasAirConditioning, hasComputer, hasTV, capacity})


    reply.code(200).send(room)

};

export const getRoom = async (request: FastifyRequest, reply: FastifyReply) => {
    const { number } = request.params as {number: string};

    if(!number){
        throw new Error("Número não informado")
    }

    const room = await roomService.getRoom({number})

    reply.code(200).send(room)

}

export const updateRoom = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as {id: string};
    const { number,isAvailable, hasAirConditioning, hasComputer, hasTV, capacity } = request.body as Room;

    if(!id && !number && !isAvailable && !hasAirConditioning && !hasComputer && !hasTV && !capacity){
        throw new Error("Todos os campos precisam ser preenchidos!")
    }

    const room = await roomService.updateRoom({id, number, isAvailable, hasAirConditioning, hasComputer, hasTV, capacity})

    reply.code(200).send(room)

}

export const getAllRoom = async(request: FastifyRequest, reply: FastifyReply)=>{
    
    const room = await roomService.getAllRoom()

    reply.code(200).send(room)
}

export const deleteRoom = async(request: FastifyRequest, reply: FastifyReply)=>{
    const {id} = request.params as {id: string}
    
    const room = await roomService.deleteRoom({id})

    reply.code(200).send(room)
}