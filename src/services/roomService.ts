import { number } from "zod";
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

export const getRoomAvailability = async ({ date }: { date: string }) => {
  // Defina o horário de abertura e fechamento
  const openingTime = new Date(`${date}T08:00:00Z`);
  const closingTime = new Date(`${date}T17:00:00Z`);

  // Busque todos os agendamentos para o dia específico
  const bookings = await prisma.schedule.findMany({
      where: {
          date: {
              gte: new Date(date + 'T00:00:00Z'), // Começo do dia
              lte: new Date(date + 'T23:59:59Z'), // Fim do dia
          },
      },
      select: {
          roomId: true,
          startTime: true,
          endTime: true,
      },
  });

  // Estrutura de horários a serem verificados
  const hours = Array.from({ length: 10 }, (_, i) => new Date(openingTime.getTime() + i * 60 * 60 * 1000));
  
  // Busque todas as salas disponíveis
  const allRooms = await prisma.room.findMany({
      where: { isAvailable: true },
      select: { id: true, number: true },
  });

  // Estrutura de disponibilidade das salas com IDs
  const availability = {} as Record<string, { id: string, number: number, hours: Record<string, boolean> }>;

  allRooms.forEach(room => {
      const roomAvailability: Record<string, boolean> = {};

      // Para cada hora, verifique a disponibilidade
      hours.forEach(hour => {
          const hourString = hour.toISOString().substring(11, 16); // Formato HH:MM

          // Verifique se há reservas que conflitam com a hora atual
          const isBooked = bookings.some(booking => {
              return booking.roomId === room.id && (
                  booking.startTime < new Date(hour.getTime() + 60 * 60 * 1000) && // 1 hora de duração
                  booking.endTime > hour // Reserva começa antes do término e termina depois da hora atual
              );
          });

          // A sala está disponível se não houver reservas
          roomAvailability[hourString] = !isBooked;
      });

      // Adicione o id e os horários na estrutura de disponibilidade
      availability[room.number] = {
          number: room.number,
          id: room.id,
          hours: roomAvailability
      };
  });

  return availability;
};







