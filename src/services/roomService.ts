import prisma from "../models/prismaClient";
import { Room } from "../types";

export const createRoom = async ({ number, isAvailable, hasAirConditioning, hasTV, hasComputer, capacity }: Room) => {

  const room = await prisma.room.findUnique({
    where:{
      number: number
    }
  })

  if(room){
    throw new Error(`Sala ${number} já existe`)
  }


  const newRoom = await prisma.room.create({
    data: {
      number: number,
      isAvailable: isAvailable,
      hasAirConditioning: hasAirConditioning,
      hasTV: hasTV,
      hasComputer: hasComputer,
      capacity: capacity,
    },
  });

  if(!newRoom){
    throw new Error("Erro ao criar sala")
  }


  return newRoom;
};

export const getRoom = async ({number} : {number : string}) =>{

  const formatNumber = parseInt(number);

  const room = await prisma.room.findUnique({
    where: {
      number: formatNumber
    }
  })

  if(!room){
    throw new Error(`Sala ${number} não existe`)
  }

  return room
};

export const getRoomById = async ({roomId} : {roomId : string}) =>{

  const room = await prisma.room.findFirst({
    where: {
      id: roomId
    }
  })

  if(!room){
    throw new Error(`Sala não existe`)
  }

  return room
};

export const getAllRoom = async () =>{

  const room = await prisma.room.findMany()

  if(!room){
    throw new Error(`Erro ao buscar salas`)
  }


  return room
};

export const updateRoom = async ({id, number, isAvailable, hasAirConditioning, hasTV, hasComputer, capacity }: Room & { id:string}) => {

  const room = await prisma.room.findFirst({
    where:{
      id: id
    }
  })

  if(!room){
    throw new Error(`Sala ${number} não existe`)
  }

    const existingRoomWithNumber = await prisma.room.findUnique({
      where: {
        number: number,
      },
    });
  
    if (existingRoomWithNumber && existingRoomWithNumber.id !== id) {
      throw new Error("Número de sala informado já existe");
    }

  const newNumber = room.number !== number ? number : room.number;
  const newIsAvailable = room.isAvailable !== isAvailable ? isAvailable : room.isAvailable
  const newHasAirConditioning = room.hasAirConditioning !== hasAirConditioning ? hasAirConditioning : room.hasAirConditioning
  const newHasTV = room.hasTV !== hasTV ? hasTV : room.hasTV
  const newHasComputer = room.hasComputer !== hasComputer ? hasComputer : room.hasComputer
  const newCapacity = room.capacity !== capacity ? capacity : room.capacity


  const updateedRoom = await prisma.room.update({
    where:{
      id: id
    },
    data: {
      number: newNumber,
      isAvailable: newIsAvailable,
      hasAirConditioning: newHasAirConditioning,
      hasTV: newHasTV,
      hasComputer: newHasComputer,
      capacity: newCapacity,
    },
  });

  if(!updateedRoom){
    throw new Error("Erro ao criar sala")
  }


  return updateedRoom;
};

export const deleteRoom = async ({id}:{id:string} )=> {

  const room = await prisma.room.findFirst({
    where:{
      id:id
    }
  })

  if(!room){
    throw new Error("Sala informada não existe")
  }

  const deletedRoom = await prisma.room.delete({
    where:{
      id:id
    }
  })

  if(!deleteRoom){
    throw new Error("Erro ao deletar sala")
  }

  return deletedRoom;
};