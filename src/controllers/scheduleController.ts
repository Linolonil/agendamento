import { FastifyRequest, FastifyReply } from "fastify";
import * as scheduleService from "../services/scheduleService";
import * as roomService from "../services/roomService";
import prisma from "../models/prismaClient";
import { Schedule } from "@prisma/client";

const checkRoomAvailability = async (roomId: string, date: Date, startTime: Date, endTime: Date) => {
  const room = await roomService.getRoomById({ roomId });
  if (!room || !room.isAvailable) {
    throw new Error("Sala não disponível");
  }

  const conflictingSchedules = await prisma.schedule.findMany({
    where: {
      roomId: roomId,
      date: new Date(date),
      OR: [
        { startTime: { gte: startTime, lt: endTime } }, // O novo agendamento começa durante um existente
        { endTime: { gt: startTime, lt: endTime } },   // O novo agendamento termina enquanto um existente começa
        { startTime: { lte: startTime }, endTime: { gte: endTime } }, // O novo agendamento cobre um existente
      ]
    }
  });

  return conflictingSchedules.length === 0;
};

export const createSchedule = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { userId, lawyerId, roomId, date, startTime, type, confirmed } = request.body as Schedule;

    console.log(userId, lawyerId, roomId, date, startTime, type, confirmed);

    const parsedDate = new Date(date); 
    const parsedStartTime = new Date(startTime); 

    if (isNaN(parsedDate.getTime()) || isNaN(parsedStartTime.getTime())) {
      return reply.code(400).send({ message: "Data ou horário inválido." });
    }

    const duration = type === "hearing" ? 3 * 60 * 60 * 1000 : 60 * 60 * 1000; 
    const endTime = new Date(parsedStartTime.getTime() + duration); 

    const isAvailable = await checkRoomAvailability(roomId, parsedDate, parsedStartTime, endTime);

    if (!isAvailable) { 
      return reply.code(400).send({ message: "Sala não disponível para o horário solicitado." });
    }

    const schedule = await scheduleService.createSchedule({
      userId,
      lawyerId,
      roomId,
      date: parsedDate, 
      startTime: parsedStartTime, 
      endTime: endTime, 
      type,
      confirmed,
    });
    

    return reply.code(201).send({ message: "Agendamento criado com sucesso!", schedule });
  } catch (error) {
    return reply.code(500).send({ error: (error as Error).message }); // Usar 500 para erros de servidor
  }
};

export const getAllSchedules = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const schedules = await scheduleService.getAllSchedules();
    return reply.code(200).send(schedules); // Retornar 200 em vez de 201 para busca
  } catch (error) {
    return reply.code(500).send({ error: (error as Error).message }); // Usar 500 para erros de servidor
  }
};
